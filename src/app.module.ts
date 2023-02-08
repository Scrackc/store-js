import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { ExpirationModule } from './expiration/expiration.module';
import { SaleDetailModule } from './sale-detail/sale-detail.module';
import { SaleModule } from './sale/sale.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      password: process.env.DB_PASSWORD,
      username: process.env.DB_USERNAME,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      synchronize: true,
      autoLoadEntities: true
    }),
    ProductModule,
    ExpirationModule, 
    SaleDetailModule, 
    SaleModule, CommonModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
