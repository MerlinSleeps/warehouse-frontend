import express from 'express';
import Database from './model/database';
import ModelService from './model/model-service';
import ShopChannel from './shop-channel';
import WarehouseChannel from './warehouse-channel';

// tslint:disable-next-line:no-var-requires
const cors = require('cors');
const app = express();
app.use(cors());
const port = 5001;

const model = new ModelService();
const warehouseChannel = new WarehouseChannel();
warehouseChannel.model = model;
model.warehouseChannel = warehouseChannel;

const shopChannel = new ShopChannel();
shopChannel.model = model;
model.shopChannel = shopChannel;

// load database
const database = new Database();
model.database = database;

model.loadOldEvents();

// meg for backend
app.get('/', (req, res) => {
    res.send('Hello from Shop Backend');
});
app.post('/warehouse2shop', (req, res) => {
    console.log('Message from Warehouse')
    warehouseChannel.handle(req, res);
});
app.post('/shop2shop', (req, res) => {
    console.log('Message from Shop');
    shopChannel.handle(req, res);
});
app.listen(port, (err) => {
    if (err) {
        return console.error(err);
    }
    return console.log(`server is listening on ${port}`);
});
