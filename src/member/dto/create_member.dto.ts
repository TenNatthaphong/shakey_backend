import { Member_level } from "@prisma/client";

export class CreateMemberDto {
    user_id: string;
    level?: Member_level;
}