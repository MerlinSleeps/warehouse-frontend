import {tryReadFile} from 'tslint/lib/files/reading';
import {ConnectionOptions} from 'typeorm';
import {PostgresConnectionOptions} from 'typeorm/driver/postgres/PostgresConnectionOptions';
import DBEvent from './model/db-event';

const typeOrmConfig: PostgresConnectionOptions = {
    database: 'postgres',
    entities: [
        DBEvent,
    ],
    host: 'localhost',
    logging: true,
    password: 'Hasu191',
    port: 5432,
    synchronize: true,
    type: 'postgres',
    username: 'postgres',
}

export {typeOrmConfig};
