import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ShipmentsService } from './shipments.service';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { User } from '../auth/entities/user.entity';

interface AuthRequest extends Request {
  user: User;
}

@Controller('shipments')
export class ShipmentsController {
  constructor(private readonly shipmentsService: ShipmentsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get(':trade_deal_id')
  async getMilestonesByDeal(@Param('trade_deal_id') tradeDealId: string) {
    return this.shipmentsService.findByDeal(tradeDealId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('milestones')
  @HttpCode(HttpStatus.CREATED)
  async recordMilestone(
    @Request() req: AuthRequest,
    @Body() dto: CreateMilestoneDto,
  ) {
    const user: User = req.user;

    if (user.role !== 'trader') {
      throw new ForbiddenException({
        code: 'ROLE_REQUIRED',
        message: 'Only traders can record milestones.',
      });
    }

    return this.shipmentsService.recordMilestone(user.id, dto);
  }
}
