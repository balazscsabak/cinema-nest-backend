import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHallDto } from './dto/create-hall.dto';
import { UpdateHallDto } from './dto/update-hall.dto';
import { Hall } from './entities/hall.entity';

@Injectable()
export class HallsService {
  constructor(
    @InjectRepository(Hall) private hallsRepository: Repository<Hall>,
  ) {}

  async create(createHallDto: CreateHallDto): Promise<Hall> {
    const newHall = this.hallsRepository.create(createHallDto);
    const saveHall = await this.hallsRepository.save(newHall);

    return saveHall;
  }

  async findAll(): Promise<Hall[]> {
    const halls = await this.hallsRepository.find();

    return halls;
  }

  async findOne(id: number): Promise<Hall> {
    try {
      const halls = await this.hallsRepository.findOneOrFail(id);

      return halls;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  // update(id: number, updateHallDto: UpdateHallDto) {
  //   return `This action updates a #${id} hall`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} hall`;
  // }
}
