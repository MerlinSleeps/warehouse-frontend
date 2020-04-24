import { Injectable } from '@angular/core';
import {Delivery} from './delivery';
import {User} from './user';
import {Product} from './product';
import {Palette} from './palette';
import {WarehouseChannels} from '../channels/warehouse-channels';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ModelService {
  public static readonly USER_DATA = 'user_data';
  public static readonly CURRENT_USER_DATA = 'current_user_data';
  public static readonly PALETTE_DATA = 'palette_data';
  public static readonly CURRENT_PALETTE = 'current_palette_data';
  public static readonly ADDED_IN_FRONTEND = 'added_in_frontend';
  public static readonly STORED_IN_FRONTEND = 'stored_in_frontend';
  public static readonly STORED_IN_BACKEND = 'stored_in_backend';
  public static readonly DELIVERY_DATA = 'delivery-data';
  public static readonly DELIVERY_SENT = 'delivery-sent';
  public static readonly DELIVERY_RECEIVED = 'delivery-received';
  public static readonly DELIVERY_PICKED = 'delivery-picked';
  public static readonly DELIVERY_SHIPPED = 'delivery-shipped';
  public date: string;
  public currentUser: User;
  public currentPalette: Palette;
  public product: Product;
  public items: number;
  public prio: string;
  userList: User[] = [];
  public paletteList: Palette[] = [];
  private productList: Product[] = [];
  productName: string;
  public currentProduct: Product;
  private dateMillis = 0;
  public warehouseChannel: WarehouseChannels;
  public deliveryList: Delivery[] = [];

  constructor(public http: HttpClient) {
    this.date = new Date().toISOString();
  }

  public initChannels() {
    this.warehouseChannel = new WarehouseChannels();
    this.warehouseChannel.model = this;
  }

  loadsEvent() {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('warehouse-')) {
        const item = localStorage.getItem(key);
        const event = JSON.parse(item);
        this.apply(event);
      }
    }
  }

  public apply(event: any) {
    if (event.eventType === ModelService.USER_DATA) {
      this.user_data(event.id, event.name, event.date);
    } else if (event.eventType === ModelService.CURRENT_USER_DATA) {
      const user = this.getOrCreateUser(event.id);
      this.currentUser_data(user);
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


  currentUser_data(user: User) {
    this.currentUser = user;
    const event = {
      eventType: ModelService.CURRENT_USER_DATA,
      id: user.id,
    };
    console.log(`warehouse-currentUser-${event.id}`);
    localStorage.setItem(`warehouse-currentUser-${event.id}`, JSON.stringify(event));
  }

  user_data(id: string, name: string, date: string) {
    const user = this.getOrCreateUser(id);
    if (user.date >= date) {
      return user;
    }
    user.name = name;
    user.date = date;
    const event = {
      eventType: ModelService.USER_DATA,
      id: user.id,
      name: user.name,
      date: user.date,
    };
    localStorage.setItem(`warehouse-user-${id}`, JSON.stringify(event));
    return user;
  }

  paletteData(id: string,
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
    palette.state = state;
    palette.user = user;
    const event = this.buildPaletteEvent(palette);
    if (palette.state === ModelService.STORED_IN_BACKEND) {
      const i = this.paletteList.indexOf(palette);
      this.paletteList.slice(i, 1);
      localStorage.removeItem(`warehouse-palette-${id}`);
      return null;
    }
    console.log(palette.state);
    localStorage.setItem(`warehouse-palette-${id}`, JSON.stringify(event));
    return palette;
  }

  public buildPaletteEvent(palette) {
    const event = {
      eventType: ModelService.PALETTE_DATA,
      id: palette.id,
      product: palette.product,
      items: palette.items,
      place: palette.place,
      priority: palette.priority,
      date: palette.date,
      state: palette.state,
      user: palette.user,
    };
    return event;
  }

  getOrCreateUser(id: string) {
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

  getOrCreatePalette(id: string) {
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

  getDate() {
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
    delivery.state = state;
    const event = this.buildDeliveryEvent(delivery);
    localStorage.setItem(`warehouse-palette-${id}`, JSON.stringify(event));
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

