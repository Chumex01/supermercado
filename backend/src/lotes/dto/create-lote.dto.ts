import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateLoteDto {
  @ApiProperty({ example: 1, description: 'ID de la orden de compra' })
  @IsNotEmpty()
  @IsString()
  numero_lote: string;
  @ApiProperty({ example: '2023-01-01', description: 'Fecha de vencimiento' })
  @IsNotEmpty()
  @IsString()
  fecha_vencimiento: string;
  @ApiProperty({ example: 10, description: 'Cantidad recibida' })
  @IsNotEmpty()
  @IsNumber()
  cantidad_recibida: number;
  @ApiProperty({ example: 100, description: 'Costo unitario' })
  @IsNotEmpty()
  @IsNumber()
  costo_unitario: number;
  @ApiProperty({ example: 1, description: 'ID de la orden de compra' })
  @IsNotEmpty()
  @IsNumber()
  orden_compra_id: number;
  @ApiProperty({ example: 1, description: 'ID del producto' })
  @IsNotEmpty()
  @IsNumber()
  producto_id: number;
}
