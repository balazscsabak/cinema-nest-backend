import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFilmDto } from './dto/create-film.dto';
import { Film } from './entities/film.entity';

@Injectable()
export class FilmsService {
  constructor(
    @InjectRepository(Film) private filmsRepository: Repository<Film>,
  ) {}

  findAll(): Promise<Film[]> {
    return this.filmsRepository.find({
      take: 5,
      order: {
        id: 'DESC',
      },
    });
  }

  findById(id: number): Promise<Film> {
    return this.filmsRepository.findOne(id);
  }

  async createFilm(createFilmDto: CreateFilmDto): Promise<Film> {
    const exist = await this.filmsRepository.findOne({
      externalId: createFilmDto.externalId,
    });

    if (exist) {
      return;
    }

    const newFilm = this.filmsRepository.create({
      name: createFilmDto.name,
      externalId: createFilmDto.externalId,
      description: createFilmDto.description,
      posterPath: process.env.EXTERNAL_IMAGE_URL + createFilmDto.posterPath,
      releaseDate: createFilmDto.releaseDate,
      playTime: createFilmDto.playTime,
    });

    return this.filmsRepository.save(newFilm);
  }
}
