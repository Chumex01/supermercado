import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOrdenCompraDto {
  @IsNotEmpty()
  @IsNumber()
  solicitud_id: number;
  @IsNotEmpty()
  @IsNumber()
  proveedor_id: number;
  @IsNotEmpty()
  @IsString()
  nombre_orden: string;
  @IsNotEmpty()
  @IsNumber()
  cantidad_ordenada: number;
  @IsNotEmpty()
  @IsNumber()
  precio_unitario: number;
}
