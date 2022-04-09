export class CreateReservationDto {
  firstName: string;
  lastName: string;
  email: string;
  sessionId: number;
  tickets: { row: number; seat: number }[];
}
