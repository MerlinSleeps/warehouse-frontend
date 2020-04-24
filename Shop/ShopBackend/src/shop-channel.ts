import ModelService from './model/model-service';
import Product from './model/product';

export default class ShopChannel {
    public model: ModelService;
    private frontendProductList: Product[] = [];

    public handle(req, res) {
        let body = '';
        console.log('shop reached')
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', () => {
            console.log(`Got post: \n${body}\n`);
            this.synchronizePostFromShop(res, JSON.parse(body));
        });
    }

    private synchronizePostFromShop(res, body) {
        const answer = {
            eventList: [],
            greetings: 'Hello from shop Backend',
        };

        // consume incoming events
        console.log(`Shop Backend got post from Shop Frontend: ${body.greetings}`);

        this.frontendProductList = [];
        for (const event of body.eventList) {
            if (event.eventType === ModelService.PRODUCT_DATA) {
                const product = this.model.getOrCreateProduct(event.id);
                this.frontendProductList.push(product);
            }
            this.model.apply(event);
        }

        // produce outgoing events

        for (const product of this.model.productList) {
            const event = this.model.buildProductEvent(product);
            answer.eventList.push(event);
        }

        for (const delivery of this.model.deliveryList) {
            const event = this.model.buildDeliveryEvent(delivery);
            answer.eventList.push(event);
        }

        for (const user of this.model.userList) {
            const event = {
                date: user.date,
                eventType: ModelService.USER_DATA,
                id: user.id,
                name: user.name,
            };
            answer.eventList.push(event);
        }

        res.status(200)
            .send(answer)
            .end('ok');
    }
}
