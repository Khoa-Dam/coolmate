import { IsInt, IsUUID, Min } from 'class-validator';

export class AddToCartDto {
  @IsUUID()
  productId: string;

  @IsUUID()
  productOptionId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
