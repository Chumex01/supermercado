import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateSolicitudCompraDto {
  @ApiProperty({ example: 1, description: 'ID del empleado' })
  @IsNotEmpty()
  @IsNumber()
  empleado_id: number; // foránea hacia Empleado

  @ApiProperty({ example: 1, description: 'ID de la sucursal' })
  @IsNotEmpty()
  @IsNumber()
  sucursal_id: number; // foránea hacia Sucursal

  @ApiProperty({ example: 1, description: 'ID del producto' })
  @IsNotEmpty()
  @IsNumber()
  producto_id: number; // foránea hacia Producto

  @ApiProperty({
    example: 'Solicitud de compra',
    description: 'Nombre de la solicitud',
  })
  @IsNotEmpty()
  @IsString()
  nombre_solicitud: string; // campo opcional

  @ApiProperty({
    example: 5,
    description: 'Cantidad solicitada del producto',
  })
  @IsNotEmpty()
  @IsNumber()
  cantidad_solicitada: number;

  @ApiProperty({
    example: 'Falta de productos',
    description: 'Justificación de la solicitud',
  })
  @IsNotEmpty()
  @IsString()
  justificacion: string;
}
