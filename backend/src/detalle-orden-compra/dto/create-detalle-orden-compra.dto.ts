import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateDetalleOrdeCompraDto {
  @IsNotEmpty()
  @IsNumber()
  cantidad_ordenada: number;
  @IsNotEmpty()
  @IsNumber()
  precio_unitario: number;
  @IsNotEmpty()
  @IsNumber()
  subtotal: number;
  @IsNotEmpty()
  @IsNumber()
  orden_compra_id: number;
  @IsNotEmpty()
  @IsNumber()
  producto_id: number;
}
