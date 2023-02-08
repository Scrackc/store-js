import { Type } from "class-transformer";
import { IsNumber, ValidateNested } from "class-validator";
import { CreateSaleDetailDto } from '../../sale-detail/dto/create-sale-detail.dto';

export class CreateSaleDto {

    @ValidateNested({each: true})
    @Type(() => CreateSaleDetailDto)
    products: CreateSaleDetailDto[];
    
}
