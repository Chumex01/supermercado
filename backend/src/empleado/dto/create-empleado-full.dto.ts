import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Cargo } from '../empleado.entity';

export class CreateEmpleadoAutoDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  sucursal_id: number;

  @ApiProperty({ example: 'Carlos' })
  @IsNotEmpty()
  @IsString()
  nombres: string;

  @ApiProperty({ example: 'Ramirez' })
  @IsNotEmpty()
  @IsString()
  apellidos: string;

  @ApiProperty({ example: '12345678' })
  @IsNotEmpty()
  @IsString()
  documento_identidad: string;

  @ApiProperty({ example: '78945612', required: false })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiProperty({ enum: Cargo, example: 'cajero' })
  @IsNotEmpty()
  @IsEnum(Cargo)
  cargo: Cargo;

  @ApiProperty({ example: '2023-01-01', required: false })
  @IsOptional()
  @IsString()
  fecha_contratacion?: string;
}
