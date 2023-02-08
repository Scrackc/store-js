import { IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateExpirationDto } from '../../expiration/dto/create-expiration.dto';

export class AddStockDto{

    @IsNumber()
    stock: number;

    @IsOptional()
    @ValidateNested({each: true})
    @Type( () => CreateExpirationDto )
    expirations?: CreateExpirationDto[];
}