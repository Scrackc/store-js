import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSaleDetailDto } from './dto/create-sale-detail.dto';
import { SaleDetail } from './entities/sale-detail.entity';
import { Product } from '../product/entities/product.entity';

@Injectable()
export class SaleDetailService {

  constructor(
    @InjectRepository(SaleDetail)
    private readonly saleRepository: Repository<SaleDetail>,
  ){}

  create(createSaleDetailDto: CreateSaleDetailDto, product: Product) {
    const { quantity} = createSaleDetailDto;
    if(product.stock < quantity){
      throw new BadRequestException(`El producto ${product.name} no tiene el stock disponible`);
    }
    return this.saleRepository.create({ 
      product,
      quantity,
      subTotal: quantity * product.priceSale
    })
  }
}
