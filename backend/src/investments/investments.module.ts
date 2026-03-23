import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvestmentsService } from './investments.service';
import { InvestmentsController } from './investments.controller';
import { Investment } from './entities/investment.entity';
import { TradeDeal } from '../trade-deals/entities/trade-deal.entity';
import { StellarModule } from '../stellar/stellar.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Investment, TradeDeal]),
    StellarModule,
  ],
  controllers: [InvestmentsController],
  providers: [InvestmentsService],
  exports: [InvestmentsService],
})
export class InvestmentsModule {}
