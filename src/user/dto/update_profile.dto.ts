import { Type } from "class-transformer";

export class EditProfileDto {
  email?: string;
  username?: string;
  firstname?: string;
  lastname?: string;
  phone?: string;
  @Type(() => Date)
  birthday?: Date;   
}