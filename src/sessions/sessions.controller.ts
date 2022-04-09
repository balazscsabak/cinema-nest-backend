import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  CACHE_MANAGER,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { Cache } from 'cache-manager';

@Controller('sessions')
export class SessionsController {
  constructor(
    private readonly sessionsService: SessionsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get('today')
  async findToday() {
    let cacheValue = await this.cacheManager.get('today-films');

    if (cacheValue) {
      return cacheValue;
    }

    const todayFilms = await this.sessionsService.findToday();
    const grouppedFilms = {};

    todayFilms.forEach((element) => {
      if (!grouppedFilms[element.filmId]) {
        grouppedFilms[element.filmId] = [];
        grouppedFilms[element.filmId].push(element);
      } else {
        grouppedFilms[element.filmId].push(element);
      }
    });

    const returnGrouppedFilmes = [];

    Object.keys(grouppedFilms).map((id) =>
      returnGrouppedFilmes.push({
        filmId: id,
        name: grouppedFilms[id][0].film.name,
        sessions: grouppedFilms[id],
      }),
    );

    await this.cacheManager.set('today-films', returnGrouppedFilmes, {
      ttl: 10,
    });

    return returnGrouppedFilmes;
  }

  @Post()
  create(@Body() createSessionDto: CreateSessionDto) {
    return this.sessionsService.create(createSessionDto);
  }

  @Get()
  findAll() {
    return this.sessionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sessionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSessionDto: UpdateSessionDto) {
    return this.sessionsService.update(+id, updateSessionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sessionsService.remove(+id);
  }
}
