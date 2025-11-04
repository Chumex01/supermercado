import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
  //   IsDecimal,
} from 'class-validator';

export enum UnidadMedida {
  UNIDAD = 'unidad',
  KG = 'kg',
  LITRO = 'litro',
  PAQUETE = 'paquete',
}

export class CreateProductoDto {
  @ApiProperty({
    example: '1234567890123',
    description: 'Código de barras único del producto',
  })
  @IsNotEmpty()
  @IsString()
  codigo_barras: string;

  @ApiProperty({
    example: 'Arroz',
    description: 'Nombre del producto',
  })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiProperty({
    example: 'Arroz integral 1kg',
    description: 'Descripción del producto',
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({
    example: 12.5,
    description: 'Precio de venta del producto',
  })
  @IsNotEmpty()
  @IsNumber()
  precio_venta: number;

  @ApiProperty({
    example: 'unidad',
    description: 'Unidad de medida del producto',
    enum: UnidadMedida,
  })
  @IsOptional()
  @IsEnum(UnidadMedida)
  unidad_medida?: UnidadMedida;

  @ApiProperty({
    example: 1,
    description: 'ID de la categoría a la que pertenece el producto',
  })
  @IsNotEmpty()
  @IsNumber()
  categoriaId: number;

  @ApiProperty({
    example: 2,
    description: 'ID del proveedor del producto',
  })
  @IsNotEmpty()
  @IsNumber()
  proveedorId: number;
}
