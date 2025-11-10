// src/ventas/dto/update-venta-estado.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { EstadoVenta } from '../venta.entity';

export class UpdateVentaEstadoDto {
  @ApiProperty({
    enum: EstadoVenta,
    example: EstadoVenta.CANCELADA,
    description: 'Nuevo estado de la venta',
  })
  @IsNotEmpty()
  @IsEnum(EstadoVenta)
  estado: EstadoVenta;
}
