import Axios from 'axios';
import ModelService from './model/model-service';

export default class WarehouseChannel {
    public model: ModelService;
    private warehouseURL = 'http://localhost:5000/shop2warehouse';

    public handle(req, res) {
        let body = '';
        console.log('shop reached')
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', () => {
            console.log(`Got post: \n${body}\n`);
            this.synchronizePostFromWarehouse(res, JSON.parse(body));
        });
    }

    public synchronizePostFromWarehouse(res, body) {
        const answer = {
            eventList: [],
            greetings: 'Hello from shop Backend',
        };

        // consume incoming events
        console.log(`Shop got post from Warehouse: ${body.greetings}`);

        for (const event of body.eventList) {
            this.model.apply(event);
        }

        res.status(200)
            .send(answer)
            .end('ok');
    }

    public async sendSynchronizeToWarehouse() {
        const message = {
            eventList: [],
            greetings: 'Hello to shop from the Backend',
        };

        // produce outgoing events
        for (const delivery of this.model.deliveryList) {
            const event = this.model.buildDeliveryEvent(delivery);
            message.eventList.push(event);
        }

        console.log(message);
        // send message
        try {
            const respons = await Axios.post(this.warehouseURL, message);
            const data = respons.data;
            console.log(`Shop Backend got from Warehouse: ${JSON.stringify(data)}`);
        } catch (error) {
            console.log(`Shop Backend got from Warehouse: ${error}`);
        }
    }
}
