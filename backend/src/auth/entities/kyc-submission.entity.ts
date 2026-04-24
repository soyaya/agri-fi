import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export type KycSubmissionStatus = 'pending_review' | 'approved' | 'rejected';

@Entity('kyc_submissions')
export class KycSubmission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'government_id_url' })
  governmentIdUrl: string;

  @Column({ name: 'proof_of_address_url' })
  proofOfAddressUrl: string;

  @Column({ default: 'pending_review' })
  status: KycSubmissionStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
