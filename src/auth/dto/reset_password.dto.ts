import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  reset_token: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  new_password: string;
}
