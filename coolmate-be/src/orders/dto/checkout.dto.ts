import { Type } from 'class-transformer';
import { IsIn, IsOptional, IsString, ValidateNested } from 'class-validator';

export class ShippingInfoDto {
  @IsString()
  fullName: string;

  @IsString()
  phone: string;

  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsString()
  district: string;

  @IsString()
  ward: string;

  @IsOptional()
  @IsString()
  note?: string;
}

export class CheckoutDto {
  @ValidateNested()
  @Type(() => ShippingInfoDto)
  shippingInfo: ShippingInfoDto;

  @IsIn(['COD', 'VNPAY_MOCK'])
  paymentMethod: 'COD' | 'VNPAY_MOCK';
}
