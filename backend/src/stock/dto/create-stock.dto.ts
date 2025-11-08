import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateStockDto {
  @ApiProperty({ example: 10, description: 'Cantidad disponible' })
  @IsNotEmpty()
  @IsNumber()
  cantidad_disponible: number;
  @ApiProperty({ example: 5, description: 'Cantidad mínima' })
  @IsNotEmpty()
  @IsNumber()
  cantidad_minima: number;
  @ApiProperty({
    example: 'Pasillo 1, Estante 1',
    description: 'Ubicación del stock',
  })
  @IsNotEmpty()
  @IsString()
  ubicacion: string;
  @ApiProperty({ example: 1, description: 'ID de la sucursal' })
  @IsNotEmpty()
  @IsNumber()
  sucursal_id: number;
  @ApiProperty({ example: 1, description: 'ID del lote' })
  @IsNotEmpty()
  @IsNumber()
  lote_id: number;
}
