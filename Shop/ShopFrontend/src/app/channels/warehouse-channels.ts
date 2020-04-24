import {ModelService} from '../model/model.service';
import {environment} from '../../environments/environment';

export class WarehouseChannels {
  public model: ModelService;
  public synchronize() {
    const message = {
      greeting: 'Hello from the frontend',
      eventList: [],
    };

    // send events to backend
    for (const product of this.model.productList) {
      const event = this.model.buildProductEvent(product);
      message.eventList.push(event);
    }

    for (const delivery of this.model.deliveryList) {
      if (delivery.state === ModelService.DELIVERY_SENT) {
        const event = this.model.buildDeliveryEvent(delivery);
        message.eventList.push(event);
      }
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
    this.model.http.post(`${environment.shopURL}/shop2shop`, message)
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
