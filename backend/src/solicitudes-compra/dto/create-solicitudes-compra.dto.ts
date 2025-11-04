import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateSolicitudCompraDto {
  @IsNotEmpty()
  @IsNumber()
  empleado_solicitante_id: number; // foránea hacia Empleado

  @IsNotEmpty()
  @IsNumber()
  sucursal_id: number; // foránea hacia Sucursal

  @IsOptional()
  @IsString()
  observaciones?: string; // campo opcional
}
