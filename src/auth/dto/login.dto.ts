import { IsString, MinLength } from 'class-validator';
import { BaseEmailDto } from './base_email.dto';

export class LoginDto extends BaseEmailDto{
  @IsString()
  @MinLength(8)
  password: string;
}
