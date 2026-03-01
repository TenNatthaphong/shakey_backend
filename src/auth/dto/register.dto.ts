import { IsString, MinLength } from 'class-validator';
import { BaseEmailDto } from './base_email.dto';

export class RegisterDto extends BaseEmailDto{
  @IsString()
  @MinLength(8)
  password: string;
}