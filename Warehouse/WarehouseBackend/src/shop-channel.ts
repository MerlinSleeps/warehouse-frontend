import Axios from 'axios';
import ModelService from './model/model-service';
import Palette from './model/palette';

export default class ShopChannel {
    public model: ModelService;
    public shopURL = `http://localhost:6000/warehouse2shop`;
    public async sendSynchronize() {
        const message = {
            eventList: [],
            greetings: 'Hello to shop from the Backend',
        };

        // produce outgoing events

        // send message
        try {
            const response = await Axios.post(this.shopURL, message);
            console.log(`Warehouse Backend got from Shop: ${response}`);
        } catch (error) {
            console.log(`Warehouse Backend got from Shop: ${error}`);
        }
    }
}
