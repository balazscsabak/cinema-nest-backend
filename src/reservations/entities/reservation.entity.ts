import { Session } from 'src/sessions/entities/session.entity';
import { Film } from 'src/films/entities/film.entity';
import {
  Column,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  filmId: number;

  @ManyToOne(() => Film, (film) => film.reservation)
  @JoinColumn()
  film: Film;

  @Column()
  sessionId: number;

  @ManyToOne(() => Session, (session) => session.reservation)
  @JoinColumn()
  session: Film;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;
}
