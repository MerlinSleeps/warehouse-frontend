import {ModelService} from '../model/model.service';
import {environment} from '../../environments/environment';

export class WarehouseChannels {
  public model: ModelService;
  public synchronize() {
    const message = {
      greeting: 'Hello from the frontend',
      eventList: [],
    }

    // send events to backend
    for (const palette of this.model.paletteList) {
      const event = this.model.buildPaletteEvent(palette);
      message.eventList.push(event);
    }

    for (const delivery of this.model.deliveryList) {
      const event = this.model.buildDeliveryEvent(delivery);
      message.eventList.push(event);
    }

    for (const user of this.model.userList) {
      const event = {
        eventType: ModelService.USER_DATA,
        id: user.id,
        name: user.name,
        date: user.date,
      };
      message.eventList.push(event);
    }

    console.log('sending msg');
    this.model.http.post(`${environment.warehouseURL}/warehouse`, message)
      .subscribe((data) => this.handleResponse(data));
    // handle backend events
  }

  private handleResponse(data: any) {
    for (const event of data.eventList) {
      console.log(event);
      this.model.apply(event);
    }
  }
}
