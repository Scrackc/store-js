import { BadRequestException, HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateSaleDto } from './dto/create-sale.dto';
import { Sale } from './entities/sale.entity';
import { ProductService } from '../product/product.service';
import { SaleDetailService } from '../sale-detail/sale-detail.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class SaleService {

  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,
    private readonly dataSource: DataSource,
    private readonly productService: ProductService,
    private readonly saleDetailService: SaleDetailService
  ){}

  async create(createSaleDto: CreateSaleDto, user: User) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const products = await Promise.all(createSaleDto.products.map( product => this.productService.findOne(product.code)))

      // Retirar cantidad y obtener totales
      const totals = products.map( product => {
        const {quantity} = createSaleDto.products.find(pr => pr.code === product.code);
        product.stock = product.stock - quantity;
        return {
          subTotal: product.priceSale * quantity,
          totalStore: product.pricePurchase * quantity
        }
      })

      const totalSale = totals.reduce((acc, cur) => acc += cur.subTotal, 0)
      const totalForStore = totals.reduce((acc, cur) => acc += cur.totalStore, 0)
      const newSale = this.saleRepository.create({
        totalSale,
        totalForStore,
        user
      })
      
      await queryRunner.manager.save(products);

      const productDetail = products.map( product => {
        return this.saleDetailService.create(createSaleDto.products.find(pr => pr.code == product.code), product)
      })
      await queryRunner.manager.save(productDetail);
      newSale.detailSale = productDetail;
      
      await queryRunner.manager.save(newSale);
      await queryRunner.commitTransaction();

      return newSale;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.hanldeDBExceptions(error);
    }finally{
      await queryRunner.release();
    }
  }

  findAll() {
    return this.saleRepository.find({
      relations:{
        detailSale: {
          product: true
        }
      }
    });
  }

  findOne(id: string) {
    return this.saleRepository.findOne({where: {id}, relations:{detailSale: {product: true}}});
  }

  remove(id: number) {
    return `This action removes a #${id} sale`;
  }

  private hanldeDBExceptions(error: any) {
    console.log(error);

    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    if (error.response) {
      const { message, statusCode } = error.response;
      throw new HttpException(message, statusCode)
    }
    // this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }
}
