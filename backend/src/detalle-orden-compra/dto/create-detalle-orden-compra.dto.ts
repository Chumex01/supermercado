// src/detalle-orden-compra/dto/create-detalle-orden-compra.dto.ts
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateDetalleOrdenCompraDto {
  @IsNotEmpty()
  @IsNumber()
  orden_compra_id: number;

  @IsNotEmpty()
  @IsNumber()
  producto_id: number;

  @IsNotEmpty()
  @IsNumber()
  cantidad_ordenada: number;

  @IsNotEmpty()
  @IsNumber()
  precio_unitario: number;

  @IsNotEmpty()
  @IsNumber()
  subtotal: number;
}
