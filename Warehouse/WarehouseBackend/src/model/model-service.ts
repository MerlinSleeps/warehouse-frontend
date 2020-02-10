
import ShopChannel from '../shop-channel';
import Database from './database';
import DBEvent from './db-event';
import Palette from './palette';
import Product from './product';
import User from './user';

export default class ModelService {
    public static readonly WAREHOUSE = 'warehouse-';
    public static readonly USER_DATA = 'user_data';
    public static readonly CURRENT_USER_DATA = 'current_user_data';
    public static readonly PALETTE_DATA = 'palette_data';
    public static readonly CURRENT_PALETTE: 'current_palette_data';
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
    private productList: Product[] = [];
    private dateMillis: number = 0;
    public shopChannel: ShopChannel;

    public async loadOldEvents() {
        try {
            const con = await this.database.connection;
            const eventList = await con.manager.find(DBEvent);
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
            let oldUser: User;
            if (event.userId) {
                oldUser = this.getOrCreateUser(event.userId);
            }
            this.paletteData(event.id,
                event.name,
                event.items,
                event.priority,
                event.place,
                oldUser,
                event.date,
                event.state);
        }
    }
    public paletteData(id: string,
                       product: string,
                       items: number,
                       priority: string,
                       place: string,
                       user: User,
                       state: string,
                       date: string) {
        const palette = this.getOrCreatePalette(id);
        if (palette.date > date) {
            return;
        }
        palette.product = product;
        palette.items = items;
        palette.priority = priority;
        palette.place = place;
        palette.date = date;
        palette.user = user;
        if (state === 'addedInFrontend') {
            state = 'addedInBackend';
        } else if (state === 'storedInFrontend') {
            state = 'storedInBackend';
        }
        const event = this.buildPaletteEvent(palette);
        localStorage.setItem(`${ModelService.WAREHOUSE}-palette-${id}`, JSON.stringify(event));
        //this.database.store(`${ModelService.WAREHOUSE_}${ModelService.PALETTE_DATA}-${id}`, event);
        if (palette.state === 'storedInBackend') {
            this.shopChannel.sendSynchronize();
        }
        return palette;
    }

    public buildPaletteEvent(palette) {
        const event = {
            date: palette.date,
            eventType: ModelService.PALETTE_DATA,
            id: palette.id,
            items: palette.items,
            name: palette.product,
            place: palette.place,
            priority: palette.priority,
            state: palette.state,
            user: palette.user.id,
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
        newPalette.product = this.productName;
        newPalette.items = this.items;
        newPalette.priority = this.prio;
        this.paletteList.push(newPalette);
        return newPalette;
    }

    public user_data(id: string, name: string, date: string) {
        const user = this.getOrCreateUser(id);
        if (! date || user.date >= date) {
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
        // localStorage.setItem(`warehouse-user-${id}`, JSON.stringify(event));
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
}
