import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOrdenCompraDto {
  @IsNotEmpty()
  @IsNumber()
  total: number;
  @IsNotEmpty()
  @IsNumber()
  solicitud_compra_id: number;
  @IsNotEmpty()
  @IsNumber()
  proveedor_id: number;
}
