import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { EstadoOrdenCompra } from '../orden-compra.entity';

export class UpdateOrdenEstadoDto {
  @ApiProperty({
    enum: EstadoOrdenCompra,
    example: EstadoOrdenCompra.COMPLETADA,
    description: 'Nuevo estado de la solicitud',
  })
  @IsNotEmpty()
  @IsEnum(EstadoOrdenCompra)
  estado: EstadoOrdenCompra;
}
