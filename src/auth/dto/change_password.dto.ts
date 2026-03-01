import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class ChangePasswordDto {  
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  old_password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  new_password: string;
}