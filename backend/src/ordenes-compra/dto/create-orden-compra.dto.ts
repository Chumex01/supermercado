import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOrdenCompraDto {
  @ApiProperty({ example: 1, description: 'ID de la solicitud' })
  @IsNotEmpty()
  @IsNumber()
  solicitud_id: number;
  @ApiProperty({ example: 1, description: 'ID del proveedor' })
  @IsNotEmpty()
  @IsNumber()
  proveedor_id: number;
  @ApiProperty({
    example: 'Orden de compra',
    description: 'Nombre de la orden',
  })
  @IsNotEmpty()
  @IsString()
  nombre_orden: string;
  @ApiProperty({
    example: 5,
    description: 'Cantidad ordenada del producto',
  })
  @IsNotEmpty()
  @IsNumber()
  cantidad_ordenada: number;
  @ApiProperty({
    example: 10,
    description: 'Precio unitario del producto',
  })
  @IsNotEmpty()
  @IsNumber()
  precio_unitario: number;
}
