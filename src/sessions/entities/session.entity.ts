import { Film } from 'src/films/entities/film.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filmId: number;

  @OneToOne(() => Film)
  @JoinColumn()
  film: Film;

  @Column()
  startDate: string;

  @Column()
  startTime: Date;
}
