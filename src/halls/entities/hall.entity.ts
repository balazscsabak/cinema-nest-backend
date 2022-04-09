import { Session } from 'src/sessions/entities/session.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Hall {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  seats: string;

  @OneToMany(() => Session, (session) => session.hall)
  session: Session[];
}
