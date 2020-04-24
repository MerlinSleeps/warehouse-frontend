import {PostgresConnectionOptions} from 'typeorm/driver/postgres/PostgresConnectionOptions';
import DBEvent from './model/db-event';

const typeOrmConfig: PostgresConnectionOptions = {
    database: 'shop-db',
    entities: [
        DBEvent,
    ],
    host: 'localhost',
    logging: false,
    password: 'Hasu191',
    port: 5432,
    synchronize: true,
    type: 'postgres',
    username: 'postgres',
    // url: 'postgres://postgres:Hasu191@localhost:4401',
}

export {typeOrmConfig};
