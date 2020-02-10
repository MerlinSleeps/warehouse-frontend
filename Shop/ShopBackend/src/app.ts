import express from 'express';
import ModelService from './model/model-service';
import WarehouseChannel from './warehouse-channel';

// tslint:disable-next-line:no-var-requires
const cors = require('cors');
const app = express();
app.use(cors());
const port = 6000;

const model = new ModelService();
const warehouseChannel = new WarehouseChannel();
warehouseChannel.model = model;

// load database
// const database = new Database();
// model.database = database;

//model.loadOldEvents();

// meg for backend
app.get('/', (req, res) => {
    res.send('Hello from Shop Backend');
});
app.post('/warehouse2shop`', (req, res) => {
    warehouseChannel.handle(req, res);
});
app.listen(port, (err) => {
    if (err) {
        return console.error(err);
    }
    return console.log(`server is listening on ${port}`);
});
