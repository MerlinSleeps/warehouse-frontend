
import ShopChannel from '../shop-channel';
import WarehouseChannel from '../warehouse-channel';
import Database from './database';
import DBEvent from './db-event';
import {Delivery} from './delivery';
import Product from './product';
import User from './user';

export default class ModelService {
    public static readonly SHOP_ = 'shop-';
    public static readonly USER_DATA = 'user_data';
    public static readonly PRODUCT_DATA = 'product-data';
    public static readonly DELIVERY_DATA = 'delivery-data';
    public static readonly DELIVERY_SENT = 'delivery-sent';
    public static readonly DELIVERY_RECEIVED = 'delivery-received';
    public static readonly DELIVERY_IN_PROGRESS = 'delivery-in-progress';
    public static readonly DELIVERY_SHIPPED = 'delivery-shipped';
    public static readonly DELIVERY_PICKED = 'delivery-picked';
    public productList: Product[] = [];
    public database: Database;
    public shopChannel: ShopChannel;
    public userList: User[] = [];
    public deliveryList: Delivery[] = [];
    public warehouseChannel: WarehouseChannel;

    public async loadOldEvents() {
        try {
            console.log('await connection...');
            const con = await this.database.connection;
            console.log('await con manager...');
            const eventList = await con.manager.find(DBEvent);
            console.log('loading old events...');
            for (const event of eventList) {
                const eventData = JSON.parse(event.eventText);
                this.apply(eventData);
            }
        } catch (e) {
            console.log('loading old events failed...');
            console.log(e);
        }
    }

    public apply(event: any) {
        if (event.eventType === ModelService.PRODUCT_DATA) {
            this.product_data(event.id,
                event.product,
                event.items);
        } else if (event.eventType === ModelService.DELIVERY_DATA) {
            console.log(`applying event: ${JSON.stringify(event)}`);
            const user = this.getOrCreateUser(event.user);
            const product = this.getOrCreateProduct(event.product);
            this.delivery_data(user, product, event.state);
        } else if (event.eventType === ModelService.USER_DATA) {
            this.user_data(event.id, event.name, event.date);
        }
    }

    public product_data(id: string, productName: string, items: number) {
        const product = this.getOrCreateProduct(id);
        if (items === product.items && productName === product.name) {
            return product;
        }
        product.name = productName;
        product.items = items;
        const event = this.buildProductEvent(product);
        this.database.store(`${ModelService.SHOP_}${ModelService.PRODUCT_DATA}-${event.id}`, event);
        return product;
    }

    public getOrCreateProduct(id: string) {
        for (const product of this.productList) {
            if (product.id === id) {
                return product;
            }
        }

        const newProduct = new Product();
        newProduct.id = id;
        this.productList.push(newProduct);
        return newProduct;
    }

    public buildProductEvent(product: Product) {
        const event = {
            eventType: ModelService.PRODUCT_DATA,
            id: product.id,
            items: product.items,
            product: product.name,
        };
        return event;
    }

    public user_data(id: string, name: string, date: string) {
        const user = this.getOrCreateUser(id);
        if (user.date >= date) {
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
        this.database.store(`${ModelService.SHOP_}${ModelService.PRODUCT_DATA}-${event.id}`, event);
        return user;
    }

    public getOrCreateUser(id: string) {
        for (const user of this.userList) {
            if (user.id === id) {
                console.log(`user found`);
                return user;
            }
        }
        const newUser = new User();
        newUser.id = id;
        this.userList.push(newUser);
        console.log('new user created');
        return newUser;
    }

    public delivery_data(user: User, product: Product, state: string) {
        const delivery = this.getOrCreateDelivery(user.id, product.id);

        delivery.product = product;
        delivery.user = user;
        delivery.state = state;
        if (delivery.state === ModelService.DELIVERY_RECEIVED) {
            delivery.state = ModelService.DELIVERY_IN_PROGRESS;
        } else if (delivery.state === ModelService.DELIVERY_PICKED) {
            delivery.state = ModelService.DELIVERY_SHIPPED;
        }
        const event = this.buildDeliveryEvent(delivery);
        console.log(`creating event: ${JSON.stringify(event)}`);
        this.database.store(`${ModelService.SHOP_}${ModelService.DELIVERY_DATA}-${event.id}`, event);
        if (delivery.state === ModelService.DELIVERY_SENT) {
            this.warehouseChannel.sendSynchronizeToWarehouse()
                .then((r) => console.log('sent delivery order to warehouse'));
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
            product: delivery.product.id,
            state: delivery.state,
            user: delivery.user.id,
        };
        return event;
    }
}
