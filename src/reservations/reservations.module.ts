import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { SessionsService } from 'src/sessions/sessions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hall } from 'src/halls/entities/hall.entity';
import { Film } from 'src/films/entities/film.entity';
import { Session } from 'src/sessions/entities/session.entity';

@Module({
  controllers: [ReservationsController],
  providers: [ReservationsService, SessionsService],
  imports: [TypeOrmModule.forFeature([Session, Hall, Film])],
})
export class ReservationsModule {}
