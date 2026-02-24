import { Controller, Get } from '@nestjs/common';
import { BranchService } from './branch.service';

@Controller('branch')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Get()
  async getBranch() {
    const branch = await this.branchService.getAllBranch();
    return branch.map((branch) => branch.detail);
  }
}
