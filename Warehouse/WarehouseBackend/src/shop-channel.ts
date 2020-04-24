import Axios from 'axios';
import ModelService from './model/model-service';

export default class ShopChannel {
    public model: ModelService;
    public shopURL = `http://localhost:5001/warehouse2shop`;
    public async sendSynchronize() {
        const message = {
            eventList: [],
            greetings: 'Hello to shop from the Backend',
        };

        // produce outgoing events
        const productMap = {};
        for (const pal of this.model.paletteList) {
            if (! pal.product) {
                continue;
            }
            if (pal.state !== 'stored_in_backend') {
                continue;
            }
            const shortname = pal.product.replace(' ', '');
            let items = productMap[shortname] || 0;
            items += pal.items;
            productMap[shortname] = items;
        }

        console.log(`product overview: ${JSON.stringify(productMap)}`);

        for (const key of Object.keys(productMap)) {
            const value = productMap[key];

            const event = {
                eventType: ModelService.PRODUCT_DATA,
                id: key,
                items: value,
                product: key,
            };

            message.eventList.push(event);
        }

        for (const delivery of this.model.deliveryList) {
            const event = this.model.buildDeliveryEvent(delivery);
            message.eventList.push(event);
        }

        console.log(message);
        // send message
        try {
            const respons = await Axios.post(this.shopURL, message);
            const data = respons.data;
            console.log(`Warehouse Backend got from Shop: ${JSON.stringify(data)}`);
        } catch (error) {
            console.log(`Warehouse Backend got from Shop: ${error}`);
        }
    }

    public handle(req, res) {
        console.log('Shop reached Warehouse');
        let body = '';
        req.on('data', (chunk) => {
            console.log('got chunk');
            body += chunk.toString();
        });
        req.on('end', () => {
            console.log(`Got post: \n${body}\n`);
            this.synchronize(res, JSON.parse(body));
        });
    }

    private synchronize(res, body) {
        console.log('synchronize shop and warehouse');
        const answer = {
            eventList: [],
            greetings: 'Hello from the Backend',
        };

        // consume incoming events
        for (const event of body.eventList) {
            if (event.eventType === ModelService.DELIVERY_DATA) {
                this.model.apply(event);
            }
        }

        // produce outgoing events

        res.status(200)
            .send(answer)
            .end('ok');
    }
}
