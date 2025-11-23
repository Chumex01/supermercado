// src/ventas/dto/create-venta.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsPositive,
  IsString,
} from 'class-validator';
import { MetodoPago } from '../venta.entity';

export class CreateVentaDto {
  @ApiProperty({ example: 1, description: 'ID de la sucursal' })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  sucursal_id: number;

  @ApiProperty({ example: 1, description: 'ID del empleado cajero' })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  empleado_cajero_id: number;

  @ApiProperty({ example: 1, description: 'ID del stock' })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  stock_id: number;

  @ApiProperty({ example: 2, description: 'Cantidad vendida' })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  cantidad: number;

  @ApiProperty({ example: 15.5, description: 'Precio unitario' })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  precio_unitario: number;

  @ApiProperty({
    enum: MetodoPago,
    example: MetodoPago.EFECTIVO,
    description: 'Método de pago',
  })
  @IsNotEmpty()
  @IsEnum(MetodoPago)
  metodo_pago: MetodoPago;

  @ApiProperty({ example: '12345645678', description: 'Cuenta Contable' })
  @IsNotEmpty()
  @IsString()
  cuenta_contable: string;

  @ApiProperty({ example: '12345645678', description: 'Código Transacción' })
  @IsNotEmpty()
  @IsString()
  codigo_transaccion: string;
}
