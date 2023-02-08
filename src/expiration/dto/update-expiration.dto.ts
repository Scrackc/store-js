import { PartialType } from '@nestjs/mapped-types';
import { CreateExpirationDto } from './create-expiration.dto';

export class UpdateExpirationDto extends PartialType(CreateExpirationDto) {}
