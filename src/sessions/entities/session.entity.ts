import { Reservation } from './../../reservations/entities/reservation.entity';
import { Film } from 'src/films/entities/film.entity';
import { Hall } from 'src/halls/entities/hall.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filmId: number;

  @ManyToOne(() => Film, (film) => film.session)
  @JoinColumn()
  film: Film;

  @Column({
    unique: false,
  })
  hallId: number;

  @ManyToOne(() => Hall, (hall) => hall.session)
  @JoinColumn()
  hall: Hall;

  @OneToMany(() => Session, (reservation) => reservation.film)
  reservation: Reservation[];

  @Column()
  seats: string;

  @Column()
  startDate: string;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;
}
