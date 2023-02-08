import { IsNumber, IsString } from "class-validator";

export class CreateSaleDetailDto {

    @IsString()
    code: string;

    @IsNumber()
    quantity: number;

}
