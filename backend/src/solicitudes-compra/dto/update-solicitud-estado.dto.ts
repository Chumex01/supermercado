import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { EstadoSolicitud } from '../solicitud-compra.entity';

export class UpdateSolicitudEstadoDto {
  @ApiProperty({
    enum: EstadoSolicitud,
    example: EstadoSolicitud.APROBADA,
    description: 'Nuevo estado de la solicitud',
  })
  @IsNotEmpty()
  @IsEnum(EstadoSolicitud)
  estado: EstadoSolicitud;
}
