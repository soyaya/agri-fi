import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

export type TradeDealStatus = 'draft' | 'open' | 'funded' | 'delivered' | 'completed' | 'failed';

@Entity('trade_deals')
export class TradeDeal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  commodity: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  quantity: number;

  @Column({ name: 'quantity_unit', default: 'kg' })
  quantityUnit: string;

  @Column({ name: 'total_value', type: 'numeric', precision: 10, scale: 2 })
  totalValue: number;

  @Column({ name: 'token_count' })
  tokenCount: number;

  @Column({ name: 'token_symbol', unique: true })
  tokenSymbol: string;

  @Column({
    type: 'text',
    default: 'draft',
  })
  status: TradeDealStatus;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'farmer_id' })
  farmer: User;

  @Column({ name: 'farmer_id' })
  farmerId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'trader_id' })
  trader: User;

  @Column({ name: 'trader_id' })
  traderId: string;

  @Column({ name: 'escrow_public_key', nullable: true })
  escrowPublicKey: string;

  @Column({ name: 'escrow_secret_key', nullable: true })
  escrowSecretKey: string;

  @Column({ name: 'issuer_public_key', nullable: true })
  issuerPublicKey: string;

  @Column({ name: 'total_invested', type: 'numeric', precision: 10, scale: 2, default: 0 })
  totalInvested: number;

  @Column({ name: 'delivery_date', type: 'date' })
  deliveryDate: Date;

  @Column({ name: 'stellar_asset_tx_id', nullable: true })
  stellarAssetTxId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
