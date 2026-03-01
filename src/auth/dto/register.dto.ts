import { IsString, MinLength, Matches } from 'class-validator';
import { BaseEmailDto } from './base_email.dto';

export class RegisterDto extends BaseEmailDto{
  @IsString()
  @MinLength(8, { message: "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร" })
  password: string;

  @IsString()
  firstname: string;
  
  @IsString()
  lastname: string;
  
  @IsString()
  @Matches(/^0[0-9]{9}$/, {message: 'หมายเลขโทรศัพท์ไม่ถูกต้อง'})
  phone: string;
}