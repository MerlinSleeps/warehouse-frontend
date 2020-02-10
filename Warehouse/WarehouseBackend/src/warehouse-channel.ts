import ModelService from './model/model-service';
import Palette from './model/palette';

export default class WarehouseChannel {
    public model: ModelService;
    private frontendPaletteList: Palette[] = [];
    public handle(req, res) {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.om('end', () => {
            console.log(`Got post: \n${body}\n`);
            this.synchronize(res, JSON.parse(body));
        });
    }
    private synchronize(res, body) {
        const answer = {
            eventList: [],
            greetings: 'Hello from the Backend',
        };

        // consume incoming events
        this.frontendPaletteList = [];
        for (const event of body.eventLst) {
            if (event.eventType === ModelService.PALETTE_DATA) {
                const palette = this.model.getOrCreatePalette(event.id);
                this.frontendPaletteList.push(palette);
            }
            this.model.apply(event);
        }
        // produce outgoing events
        for (const palette of this.model.paletteList) {
            if (palette.place && this.frontendPaletteList.indexOf(palette) < 0) {
                
                continue;
            }
            const event = this.model.buildPaletteEvent(palette);
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
