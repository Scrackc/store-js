import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity'
import { ExpirationModule } from '../expiration/expiration.module';
import { ExpirationMiddleware } from './middlewares/valid-expiration.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    ExpirationModule
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService]
})
export class ProductModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ExpirationMiddleware)
      .forRoutes(
        { path: '/product', method: RequestMethod.POST },
        { path: '/product/stock/:id', method: RequestMethod.POST }
      )
  }
}
