import { SessionsService } from './../sessions/sessions.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from 'src/sessions/entities/session.entity';
import { Repository } from 'typeorm';

@Controller('reservations')
export class ReservationsController {
  constructor(
    private readonly reservationsService: ReservationsService,
    private readonly sessionsService: SessionsService,
    @InjectRepository(Session) private sessionsRepository: Repository<Session>,
  ) {}

  @Post()
  async create(@Body() createReservationDto: CreateReservationDto) {
    if (
      !createReservationDto.tickets ||
      !createReservationDto.email ||
      !createReservationDto.firstName ||
      !createReservationDto.lastName ||
      !createReservationDto.sessionId ||
      createReservationDto.tickets.length <= 0
    ) {
      throw new BadRequestException();
    }

    const session = await this.sessionsService.findOne(
      createReservationDto.sessionId,
    );

    if (!session) throw new BadRequestException();

    let available = true;

    const _seats = [...JSON.parse(session.seats)];

    createReservationDto.tickets.map((ticket) => {
      if (_seats[ticket.row][ticket.seat] !== 's') available = false;

      const str = _seats[ticket.row];

      const index = ticket.seat;
      const replacement = 'r';

      const replaced =
        str.substring(0, index) + replacement + str.substring(index + 1);

      _seats[ticket.row] = replaced;
    });

    if (!available) throw new BadRequestException();

    session.seats = JSON.stringify(_seats);

    const newSession = await this.sessionsRepository.save(session);

    return this.reservationsService.create(createReservationDto);
  }
}
