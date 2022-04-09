import { HttpService } from '@nestjs/axios';
import {
  Body,
  CACHE_MANAGER,
  Controller,
  Get,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ApiFilmResponse } from './dto/api-film-response.dto';
import { CreateFilmDto } from './dto/create-film.dto';
import { Film } from './entities/film.entity';
import { FilmsService } from './films.service';
import { Cache } from 'cache-manager';
import { format } from 'date-fns';

@Controller('films')
export class FilmsController {
  constructor(
    private httpService: HttpService,
    private filmsService: FilmsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get()
  async getFilms(): Promise<Film[]> {
    const { data } = await firstValueFrom(
      this.httpService.get(
        `${process.env.EXTERNAL_API_URL}/3/movie/upcoming?api_key=${process.env.EXTERNAL_API_KEY}`,
      ),
    );
    const films: ApiFilmResponse[] = data.results;

    const today: string = format(new Date(), 'yyyy-mm-dd');

    const cacheValue: Film[] = await this.cacheManager.get(today);

    if (cacheValue) {
      return cacheValue;
    }

    const newFilms = await Promise.all(
      films.map(async (film) => {
        return this.filmsService.createFilm({
          name: film.title,
          externalId: film.id,
          description: film.overview,
          posterPath: film.poster_path,
          releaseDate: film.release_date,
          playTime: 120,
        });
      }),
    );

    const getFilms = await this.filmsService.findAll();

    await this.cacheManager.set(today, getFilms, {
      ttl: 10,
    });

    return getFilms;
  }

  @Get(':id')
  getFilmById(@Param('id') id: String): Promise<Film> {
    return this.filmsService.findById(Number(id));
  }

  @Post()
  createFilm(@Body() body: CreateFilmDto): Promise<Film> {
    return this.filmsService.createFilm(body);
  }
}
