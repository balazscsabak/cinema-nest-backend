import { Film } from 'src/films/entities/film.entity';
import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { Hall } from 'src/halls/entities/hall.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Session, Hall, Film])],
  controllers: [SessionsController],
  providers: [SessionsService],
})
export class SessionsModule {}
