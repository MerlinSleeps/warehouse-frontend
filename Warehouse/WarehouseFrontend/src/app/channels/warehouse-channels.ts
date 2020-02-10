import {ModelService} from '../model/model.service';
import {environment} from '../../environments/environment';

export class WarehouseChannels {
  public model: ModelService;
  public synchronize() {
    const message = {
      greeting: 'Hello from the frontend',
      eventLst: [],
    }
    // send events to backend
    for (const palette of this.model.paletteList) {
      const event = this.model.buildPaletteEvent(palette);
      message.eventLst.push(event);
    }

    for (const user of this.model.userList) {
      const event = {
        eventType: ModelService.USER_DATA,
        id: user.id,
        name: user.name,
        date: user.date,
      };
      message.eventLst.push(event);
    }


    this.model.http.post(`${environment.warehouseURL}/warehouse `, message)
      .subscribe((data) => this.handleResponse(data));
    // handle backend events
  }

  private handleResponse(data: any) {
    for (const event of data.eventList) {
      console.log(data);
      this.model.apply(event);
    }
  }
}
