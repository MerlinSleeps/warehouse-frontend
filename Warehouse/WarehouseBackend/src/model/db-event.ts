import {Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export default class DBEvent {
    @PrimaryColumn()
    public eventId: string;

    @Column()
    public eventText: string;
}
