import {Connection, createConnection} from 'typeorm';
import {typeOrmConfig} from '../ormconfig';
import DBEvent from './db-event';

export default class Database {
    public connection: Promise<Connection>;
    public theConnection: Connection;

    constructor() {
        console.log('createConnection ...');

        this.connection = createConnection(typeOrmConfig);

        this.connection
            .then((con) => console.log('createConnection did work'))
            .catch((e) => console.log('createConnection failed \n' + e));
    }

    public async store(eventKey: string, eventData: any) {
        console.log('trying to store data');
        try {
            const theConnection = await this.connection;
            await this.doStore(theConnection, eventKey, eventData);
        } catch (e) {
            console.log('Could not store ' + eventData);
        }
    }

    public async remove(eventKey: string) {
        try {
            const con = await this.connection;
            await con.manager.delete(DBEvent, eventKey);
            console.log('removed from database ' + eventKey);
        } catch (error) {
            console.log('removed from database failed' + eventKey);
        }
    }

    private async doStore(theConnection: Connection, eventKey: string, eventData: any) {
        // try to create a new one
        const theEvent: DBEvent = new DBEvent();
        theEvent.eventId = eventKey;
        theEvent.eventText = JSON.stringify(eventData);

        const self = this;
        try {
            const result = await theConnection.manager.save(theEvent);
            console.log('created database entry');
        } catch (error) {
            await self.doUpdate(theConnection, eventKey, eventData);
        }
    }

    private async doUpdate(theConnection: Connection, eventKey: string, eventData: any) {
        try {
            const found = await theConnection.manager.findOne(DBEvent, eventKey);
            found.eventText = JSON.stringify(eventData);
            await theConnection.manager.save(found);
            // console.log('successfully updated ' + found.eventText);
        } catch (error) {
            console.log('could not save existing event ' + eventKey);
        }
    }
}
