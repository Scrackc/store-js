import { Module } from '@nestjs/common';
import { SaleService } from './sale.service';
import { SaleController } from './sale.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { ProductModule } from '../product/product.module';
import { SaleDetailModule } from '../sale-detail/sale-detail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sale]),
    ProductModule,
    SaleDetailModule
  ],
  controllers: [SaleController],
  providers: [SaleService]
})
export class SaleModule {}
