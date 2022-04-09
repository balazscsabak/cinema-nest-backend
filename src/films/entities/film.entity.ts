import { Reservation } from './../../reservations/entities/reservation.entity';
import { Session } from 'src/sessions/entities/session.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';

@Entity()
export class Film {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  externalId: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  posterPath: string;

  @Column()
  releaseDate: string;

  @Column()
  playTime: number;

  @OneToMany(() => Session, (session) => session.film)
  session: Session[];

  @OneToMany(() => Session, (reservation) => reservation.film)
  reservation: Reservation[];
}
