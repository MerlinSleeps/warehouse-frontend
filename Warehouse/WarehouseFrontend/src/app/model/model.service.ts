import { Injectable } from '@angular/core';
import Database from '../../../../WarehouseBackend/src/model/database';
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
  public static readonly CURRENT_PALETTE: 'current_palette_data';
  /*public static readonly CURRENT_PRODUCT: 'current_product_data';
  public static PRODUCT_DATA: 'product_data';*/
  public date: string;
  public currentUser: User;
  public currentPalette: Palette;
  public employeeId: string;
  public palId: string;
  public product: Product;
  public productId: string;
  public items: number;
  public prio: string;
  userList: User[] = [];
  public paletteList: Palette[] = [];
  private productList: Product[] = [];
  productName: string;
  public currentProduct: Product;
  private dateMillis = 0;
  public warehouseChannel: WarehouseChannels;
  database: Database;

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
      let oldUser: User;
      if (event.userId) {
        oldUser = this.getOrCreateUser(event.userId);
      }
      this.paletteData(
        event.id,
        event.product,
        event.items,
        event.priority,
        event.date,
        event.state,
        event.user);
    }
  }

  currentUser_data(user: User) {
    this.currentUser = user;
    const event = {
      eventType: ModelService.CURRENT_USER_DATA,
      id: user.id,
    };
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
              priority: string,
              date: string,
              state: string,
              user: User) {
    const palette = this.getOrCreatePalette(id);
    if (palette.date >= date) {
      return;
    }
    palette.product = product;
    palette.items = items;
    palette.priority = priority;
    palette.date = date;
    palette.state = state;
    palette.user = user;
    const event = this.buildPaletteEvent(palette);
    if (palette.state === 'storedInBackend') {
      const i = this.paletteList.indexOf(palette);
      this.paletteList.slice(i, 1);
      localStorage.removeItem(`warehouse-palette-${id}`);
      return null;
    }
    localStorage.setItem(`warehouse-palette-${id}`, JSON.stringify(event));
    return palette;
  }

  public buildPaletteEvent(palette) {
    const event = {
      eventType: ModelService.PALETTE_DATA,
      id: palette.id,
      name: palette.product,
      items: palette.items,
      priority: palette.priority,
      date: palette.date,
      state: palette.state,
      user: palette.user.id,
    };
    return event;
  }

  currentPaletteData(cPalette: Palette) {
    this.currentPalette = cPalette;
    const event = {
      eventType: ModelService.CURRENT_PALETTE,
      id: cPalette.id,
    };
    localStorage.setItem( `warehouse-currentPalette-${event.id}`, JSON.stringify(event));
  }

  getOrCreateUser(id: string) {
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
}
