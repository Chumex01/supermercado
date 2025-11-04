import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Cargo } from '../empleado.entity';

export class CreateEmpleadoDto {
  @ApiProperty({
    example: 1,
    description: 'ID del usuario asociado al empleado (foránea hacia Usuarios)',
  })
  @IsNotEmpty()
  @IsNumber()
  usuario_id: number;

  @ApiProperty({
    example: 2,
    description:
      'ID de la sucursal donde trabaja el empleado (foránea hacia Sucursales)',
  })
  @IsNotEmpty()
  @IsNumber()
  sucursal_id: number;

  @ApiProperty({ example: 'Carlos', description: 'Nombres del empleado' })
  @IsNotEmpty()
  @IsString()
  nombres: string;

  @ApiProperty({ example: 'Ramírez', description: 'Apellidos del empleado' })
  @IsNotEmpty()
  @IsString()
  apellidos: string;

  @ApiProperty({
    example: '12345678',
    description: 'Documento de identidad del empleado',
  })
  @IsNotEmpty()
  @IsString()
  documento_identidad: string;

  @ApiProperty({ example: '71234567', description: 'Teléfono del empleado' })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiProperty({
    example: 'cajero',
    description: 'Cargo del empleado dentro de la sucursal',
    enum: Cargo,
  })
  @IsNotEmpty()
  @IsEnum(Cargo)
  cargo: Cargo;

  @ApiProperty({
    example: '2025-03-10',
    description: 'Fecha de contratación (en formato ISO 8601)',
  })
  @IsNotEmpty()
  @IsDateString()
  fecha_contratacion: string;
}
