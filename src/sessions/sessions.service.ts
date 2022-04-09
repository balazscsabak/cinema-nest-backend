import { format } from 'date-fns';
import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Film } from 'src/films/entities/film.entity';
import { Hall } from 'src/halls/entities/hall.entity';
import { Repository } from 'typeorm';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { Session } from './entities/session.entity';
import { Cache } from 'cache-manager';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Hall) private hallsRepository: Repository<Hall>,
    @InjectRepository(Session) private sessionsRepository: Repository<Session>,
    @InjectRepository(Film) private filmsRepository: Repository<Film>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createSessionDto: CreateSessionDto): Promise<Session> {
    try {
      if (!createSessionDto.hallId || !createSessionDto.filmId)
        throw Error('Film/Hall id required');

      const hall = await this.hallsRepository.findOne(createSessionDto.hallId);
      const film = await this.filmsRepository.findOne(createSessionDto.filmId);

      if (!hall || !film) throw Error('Hall/Film not found');

      let available = true;

      const sessions = await this.sessionsRepository.find({
        where: {
          startDate: createSessionDto.startDate,
          hallId: createSessionDto.hallId,
        },
      });

      // Interval check
      // x < s => y > s FALSE
      // x > s => x < e FALSE

      // x
      const startTime = new Date(createSessionDto.startTime).getTime();
      // y
      const endTime = startTime + film.playTime * 60000;

      sessions.map((session) => {
        // s
        const _startTime = session.startTime.getTime();
        // e
        const _endTime = session.endTime.getTime();

        if (startTime < _startTime) {
          if (endTime > _startTime) available = false;
        } else {
          if (startTime < _endTime) available = false;
        }
      });

      if (!available) throw Error('Start time already reserved');

      const newSession = this.sessionsRepository.create({
        startDate: createSessionDto.startDate,
        startTime: createSessionDto.startTime,
        endTime: new Date(
          new Date(createSessionDto.startTime).getTime() +
            film.playTime * 60000,
        ),
        filmId: createSessionDto.filmId,
        hallId: createSessionDto.hallId,
        seats: hall.seats,
      });

      const session = await this.sessionsRepository.save(newSession);

      let cacheValue = await this.cacheManager.get('today-films');

      return session;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async findAll(): Promise<Session[]> {
    return await this.sessionsRepository.find();
  }

  findOne(id: number) {
    return this.sessionsRepository.findOne(id, {
      relations: ['film', 'hall'],
    });
  }

  update(id: number, updateSessionDto: UpdateSessionDto) {
    return `This action updates a #${id} session`;
  }

  remove(id: number) {
    return `This action removes a #${id} session`;
  }

  async findToday(): Promise<Session[]> {
    const today = format(new Date(), 'yyyy-MM-dd');

    const todaySessions = await this.sessionsRepository.find({
      where: {
        startDate: today,
      },
      relations: ['film'],
    });

    return todaySessions;
  }
}
