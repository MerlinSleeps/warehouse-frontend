import express from 'express';
import Database from './model/database';
import ModelService from './model/model-service';
import ShopChannel from './shop-channel';
import WarehouseChannel from './warehouse-channel';

const app = express();
const port = 5000;
// tslint:disable-next-line:no-var-requires
const cors = require('cors');
app.use(cors());

const warehouseChannel = new WarehouseChannel();
const model = new ModelService();
warehouseChannel.model = model;

const shopChannel = new ShopChannel();
shopChannel.model = model;
model.shopChannel = shopChannel;

// load database
const database = new Database();
model.database = database;
// model.loadOldEvents();

// meg for backend
app.get('/', (req, res) => {
    res.send('Hello Backend');
});
app.post('/warehouse', (req, res) => {
    warehouseChannel.handle(req, res);
});
app.listen(port, (err) => {
    if (err) {
        return console.error(err);
    }
    return console.log(`server is listening on ${port}`);
});
