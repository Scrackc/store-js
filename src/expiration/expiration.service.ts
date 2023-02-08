import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExpirationDto } from './dto/create-expiration.dto';
import { UpdateExpirationDto } from './dto/update-expiration.dto';
import { Expiration } from './entities/expiration.entity';

@Injectable()
export class ExpirationService {

  constructor(
    @InjectRepository(Expiration)
    private readonly expirationrepository: Repository<Expiration>
  ){}

  create(createExpirationDto: CreateExpirationDto) {
    return this.expirationrepository.create({ ...createExpirationDto })
  }

  findAll() {
    return `This action returns all expiration`;
  }

  findOne(id: number) {
    return `This action returns a #${id} expiration`;
  }

  update(id: number, updateExpirationDto: UpdateExpirationDto) {
    return `This action updates a #${id} expiration`;
  }

  remove(id: number) {
    return `This action removes a #${id} expiration`;
  }
}
