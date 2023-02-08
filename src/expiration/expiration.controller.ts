import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExpirationService } from './expiration.service';
import { CreateExpirationDto } from './dto/create-expiration.dto';
import { UpdateExpirationDto } from './dto/update-expiration.dto';

@Controller('expiration')
export class ExpirationController {
  constructor(private readonly expirationService: ExpirationService) {}

  @Post()
  create(@Body() createExpirationDto: CreateExpirationDto) {
    return this.expirationService.create(createExpirationDto);
  }

  @Get()
  findAll() {
    return this.expirationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.expirationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExpirationDto: UpdateExpirationDto) {
    return this.expirationService.update(+id, updateExpirationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.expirationService.remove(+id);
  }
}
