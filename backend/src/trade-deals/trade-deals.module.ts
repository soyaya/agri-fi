import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TradeDealsController } from './trade-deals.controller';
import { TradeDealsService } from './trade-deals.service';
import { TradeDeal } from './entities/trade-deal.entity';
import { Document } from './entities/document.entity';
import { Investment } from '../users/entities/investment.entity';
import { ShipmentMilestone } from '../shipments/entities/shipment-milestone.entity';
import { StellarModule } from '../stellar/stellar.module';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TradeDeal, Document, Investment, ShipmentMilestone]),
    StellarModule,
    QueueModule,
  ],
  controllers: [TradeDealsController],
  providers: [TradeDealsService],
})
export class TradeDealsModule {}
