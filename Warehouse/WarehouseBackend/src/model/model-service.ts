
import ShopChannel from '../shop-channel';
import Database from './database';
import DBEvent from './db-event';
import {Delivery} from './delivery';
import Palette from './palette';
import Product from './product';
import User from './user';

export default class ModelService {
    public static readonly WAREHOUSE = 'warehouse-';
    public static readonly WAREHOUSE_ = 'warehouse-';
    public static readonly USER_DATA = 'user_data';
    public static readonly CURRENT_USER_DATA = 'current_user_data';
    public static readonly PALETTE_DATA = 'palette_data';
    public static readonly CURRENT_PALETTE = 'current_palette_data';
    public static readonly ADDED_IN_FRONTEND = 'added_in_frontend';
    public static readonly STORED_IN_FRONTEND = 'stored_in_frontend';
    public static readonly ADDED_IN_BACKEND = 'added_in_backend';
    public static readonly STORED_IN_BACKEND = 'stored_in_backend';
    public static readonly PRODUCT_DATA = 'product-data';
    public static readonly DELIVERY_DATA = 'delivery-data';
    public static readonly DELIVERY_SENT = 'delivery-sent';
    public static readonly DELIVERY_RECEIVED = 'delivery-received';
    public static readonly DELIVERY_PICKED = 'delivery-picked';
    public date: string;
    public currentUser: User;
    public currentPalette: Palette;
    public employeeId: string;
    public palId: string;
    public product: Product;
    public productId: string;
    public items: number;
    public prio: string;
    public paletteList: Palette[] = [];
    public productName: string;
    public userList: User[] = [];
    public database: Database;
    public shopChannel: ShopChannel;
    public deliveryList: Delivery[] = [];
    private productList: Product[] = [];
    private dateMillis: number = 0;

    public async loadOldEvents() {
        try {
            const con = await this.database.connection;
            const eventList = await con.manager.find(DBEvent);
            console.log(`loading old events`);
            for (const event of eventList) {
                const eventData = JSON.parse(event.eventText);
                this.apply(eventData);
            }
        } catch (error) {
            console.log(`loading old events failed ` + error);
        }
    }

    public apply(event: any) {
        if (event.eventType === ModelService.USER_DATA) {
            this.user_data(event.id, event.name, event.date);
        } else if (event.eventType === ModelService.PALETTE_DATA) {
            this.paletteData(
                event.id,
                event.product,
                event.items,
                event.place,
                event.priority,
                event.user,
                event.date,
                event.state);
        } else if (event.eventType === ModelService.DELIVERY_DATA) {
            this.delivery_data(event.id, event.user, event.product, event.state);
        }
    }
    public paletteData(id: string,
                       product: string,
                       items: number,
                       place: string,
                       priority: string,
                       user: User,
                       date: string,
                       state: string) {
        const palette = this.getOrCreatePalette(id);
        if (palette.date > date) {
            return;
        }
        palette.product = product;
        palette.items = items;
        palette.place = place;
        palette.priority = priority;
        palette.date = date;
        palette.user = user;
        if (state === ModelService.ADDED_IN_FRONTEND) {
            state = ModelService.ADDED_IN_BACKEND;
        } else if (state === ModelService.STORED_IN_FRONTEND) {
            state = ModelService.STORED_IN_BACKEND;
        }
        palette.state = state;
        const event = this.buildPaletteEvent(palette);
        console.log(JSON.stringify(event));
        this.database.store(`${ModelService.WAREHOUSE_}${ModelService.PALETTE_DATA}-${id}`,
            JSON.stringify(event))
            .then((r) => console.log('storing palette'));
        if (palette.state === ModelService.STORED_IN_BACKEND) {
            this.shopChannel.sendSynchronize()
                .then((r) => console.log('messaged shop'));
        }
        console.log(palette.state);
        return palette;
    }

    public buildPaletteEvent(palette) {
        const event = {
            date: palette.date,
            eventType: ModelService.PALETTE_DATA,
            id: palette.id,
            items: palette.items,
            place: palette.place,
            priority: palette.priority,
            product: palette.product,
            state: palette.state,
            user: palette.user,
        };
        return event;
    }

    public getOrCreatePalette(id: string) {
        for (const palette of this.paletteList) {
            if (palette.id === id) {
                return palette;
            }
        }
        const newPalette = new Palette();
        newPalette.id = id;
        this.paletteList.push(newPalette);
        return newPalette;
    }

    public user_data(id: string, name: string, date: string) {
        const user = this.getOrCreateUser(id);
        if (! date || user.date > date) {
            return user;
        }
        user.name = name;
        user.date = date;
        const event = {
            date: user.date,
            eventType: ModelService.USER_DATA,
            id: user.id,
            name: user.name,
        };
        this.database.store(`${ModelService.WAREHOUSE_}${ModelService.USER_DATA}-${id}`,
            JSON.stringify(event));
        return user;
    }

    public getOrCreateUser(id: string) {
        for (const user of this.userList) {
            if (user.id === id) {
                return user;
            }
        }
        const newUser = new User();
        newUser.id = id;
        this.userList.push(newUser);
        return newUser;
    }

    public getDate() {
        let time = new Date().getTime();
        if (time <= this.dateMillis) {
            time = this.dateMillis + 1;
        }
        this.dateMillis = time;
        const result = new Date(time).toISOString();
        return result;
    }

    public delivery_data(id: string, user: string, product: string, state: string) {
        const delivery = this.getOrCreateDelivery(user, product);

        delivery.product = product;
        delivery.user = user;
        if (state === ModelService.DELIVERY_SENT) {
            state = ModelService.DELIVERY_RECEIVED;
        }
        delivery.state = state;
        const event = this.buildDeliveryEvent(delivery);
        this.database.store(`${ModelService.WAREHOUSE_}${ModelService.DELIVERY_DATA}-${event.id}`, event);
        if (delivery.state === ModelService.DELIVERY_RECEIVED) {
            this.shopChannel.sendSynchronize()
                .then((r) => console.log('confirmed incoming order'));
        }
        return delivery;

    }

    public getOrCreateDelivery(userId: string, productId: string) {
        const deliveryId = `${userId}${productId}`;
        for (const delivery of this.deliveryList) {
            if (delivery.id === deliveryId) {
                return delivery;
            }
        }

        const newDelivery = new Delivery();
        newDelivery.id = deliveryId;
        this.deliveryList.push(newDelivery);
        console.log('new delivery was created');
        return newDelivery;
    }

    public buildDeliveryEvent(delivery: Delivery) {
        const event = {
            eventType: ModelService.DELIVERY_DATA,
            id: delivery.id,
            product: delivery.product,
            state: delivery.state,
            user: delivery.user,
        };
        return event;
    }
}
