import { Module } from '@nestjs/common';
import { ExpirationService } from './expiration.service';
import { ExpirationController } from './expiration.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expiration } from './entities/expiration.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Expiration])
  ],
  controllers: [ExpirationController],
  providers: [ExpirationService],
  exports: [ExpirationService]
})
export class ExpirationModule {}
