import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { CreateExpirationDto } from '../../expiration/dto/create-expiration.dto';

export class CreateProductDto {
    
    @IsString()
    @IsNotEmpty()
    code: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    stock: number;

    @IsOptional()
    @IsString()
    quantityUnits?: string;

    @IsNumber()
    minStock: number;

    @IsNumber()
    priceSale: number;

    @IsNumber()
    pricePurchase: number;

    @IsOptional()
    @IsInt()
    daysToNotify?: number;

    @IsOptional()
    @ValidateNested({each: true})
    @Type( () => CreateExpirationDto )
    expirations?: CreateExpirationDto[];

}
