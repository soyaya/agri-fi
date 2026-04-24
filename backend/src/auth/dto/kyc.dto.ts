import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class KycDto {
  @ApiProperty({
    example: 'https://s3.amazonaws.com/bucket/gov-id.pdf',
    description: 'URL of the uploaded government ID document',
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  governmentIdUrl: string;

  @ApiProperty({
    example: 'https://s3.amazonaws.com/bucket/proof-of-address.pdf',
    description: 'URL of the uploaded proof of address document',
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  proofOfAddressUrl: string;
}
