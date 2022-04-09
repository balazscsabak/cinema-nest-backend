import { Module, CacheModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FilmsModule } from './films/films.module';
import { ConfigModule } from '@nestjs/config';
import { SessionsModule } from './sessions/sessions.module';
import { HallsModule } from './halls/halls.module';
import { ReservationsModule } from './reservations/reservations.module';
import ormConfig from 'config/orm.config';

@Module({
  imports: [
    FilmsModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(ormConfig),
    CacheModule.register({
      isGlobal: true,
    }),
    SessionsModule,
    HallsModule,
    ReservationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
