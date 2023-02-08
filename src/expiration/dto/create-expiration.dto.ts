import { IsDateString, IsInt, IsNumber } from 'class-validator';
export class CreateExpirationDto {

    @IsNumber()
    quantity: number;

    @IsDateString()
    date: string;

}
