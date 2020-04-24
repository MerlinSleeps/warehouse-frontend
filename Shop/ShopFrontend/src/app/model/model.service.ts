import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {WarehouseChannels} from '../channels/warehouse-channels';
import {Delivery} from './delivery';
import {Product} from './product';
import {User} from './user';

@Injectable({
  providedIn: 'root'
})
export class ModelService {
  public static readonly SHOP_ = 'shop-';
  public static readonly USER_DATA = 'user_data';
  public static readonly PRODUCT_DATA = 'product-data';
  public static readonly CURRENT_USER_DATA = 'current_user_data';
  public static readonly DELIVERY_DATA = 'delivery-data';
  public static readonly DELIVERY_SENT = 'delivery-sent';
  public date: string;
  private dateMillis = 0;
  public currentUser: User;
  public userList: User[] = [];
  public currentProduct: Product;
  public productList: Product[] = [];
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
      if (key.startsWith('shop-')) {
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
    } else if (event.eventType === ModelService.PRODUCT_DATA) {
      this.product_data(event.id, event.name, event.items);
    } else if (event.eventType === ModelService.DELIVERY_DATA) {
      const user = this.getOrCreateUser(event.user);
      const product = this.getOrCreateProduct(event.product);
      this.delivery_data(user, product, event.state);
    }
  }

  public currentUser_data(user: User) {
    const newUser = this.getOrCreateUser(user.id);
    this.currentUser = newUser;
    const event = {
      eventType: ModelService.CURRENT_USER_DATA,
      id: newUser.id,
      name: newUser.name,
    };
    console.log(`shop-currentUser-${event.id}`);
    localStorage.setItem(`shop-currentUser-${event.id}`, JSON.stringify(event));
  }

  public user_data(id: string, name: string, date: string) {
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
    localStorage.setItem(`shop-user-${id}`, JSON.stringify(event));
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

  public getDate() {
    let time = new Date().getTime();
    if (time <= this.dateMillis) {
      time = this.dateMillis + 1;
    }
    this.dateMillis = time;
    const result = new Date(time).toISOString();
    return result;
  }

  public product_data(id: string, productName: string, items: number) {
    const product = this.getOrCreateProduct(id);
    if (items === product.items && productName === product.name) {
      return product;
    }
    product.name = productName;
    product.items = items;
    const event = this.buildProductEvent(product);
    localStorage.setItem(`shop-product-${id}`, JSON.stringify(event));
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

  public delivery_data(user: User, product: Product, state: string) {
    const delivery = this.getOrCreateDelivery(user.id, product.id);

    delivery.user = user;
    delivery.product = product;
    delivery.state = state;
    const event = this.buildDeliveryEvent(delivery);
    if (delivery.state === ModelService.DELIVERY_SENT) {
      const i = this.deliveryList.indexOf(delivery);
      this.deliveryList.slice(i, 1);
      localStorage.removeItem(`${ModelService.SHOP_}${ModelService.DELIVERY_DATA}-${event.id}`);
      return null;
    }
    localStorage.setItem(`${ModelService.SHOP_}${ModelService.DELIVERY_DATA}-${event.id}`, JSON.stringify(event));
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
      user: delivery.user.id,
      product: delivery.product.id,
      state: delivery.state,
    };
    return event;
  }
}

