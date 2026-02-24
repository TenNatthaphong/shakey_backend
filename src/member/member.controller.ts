import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { CreateMemberDto } from './dto/create_member.dto';
import { MemberService } from './member.service';

@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get()
  async getMember() {
    return this.memberService.getMember();
  }

  @Post()
  async createMember(@Body() createMemberDto: CreateMemberDto) {
    return this.memberService.createMember(createMemberDto);
  }

  @Patch(':userId')
  async updateMember(@Param('userId') userId: string) {
    return this.memberService.updateMember(userId);
  }
}
