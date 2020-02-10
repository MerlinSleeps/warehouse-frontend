import ModelService from './model/model-service';

export default class WarehouseChannel {
    public model: ModelService;
    public handle(req, res) {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.om('end', () => {
            console.log(`Got post: \n${body}\n`);
            this.synchronizePostFromWarehouse(res, JSON.parse(body));
        });
    }
    private synchronizePostFromWarehouse(res, body) {
        const answer = {
            eventList: [],
            greetings: 'Hello from shop Backend',
        };
        // consume incoming events
        console.log(`Shop got post from Warehouse: ${body.greetings}`);

        res.status(200)
            .send(answer)
            .end('ok');
    }
}
