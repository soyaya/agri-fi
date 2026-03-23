import { IsUUID, IsNumber, IsPositive, IsNotEmpty } from 'class-validator';

export class CreateInvestmentDto {
  @IsUUID()
  @IsNotEmpty()
  tradeDealId: string;

  @IsNumber()
  @IsPositive()
  tokenAmount: number;

  @IsNumber()
  @IsPositive()
  amountUsd: number;
}
