import { Module } from '@nestjs/common';
import { SaleDetailService } from './sale-detail.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaleDetail } from './entities/sale-detail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SaleDetail]),
  ],
  providers: [SaleDetailService],
  exports:[SaleDetailService]
})
export class SaleDetailModule {}
