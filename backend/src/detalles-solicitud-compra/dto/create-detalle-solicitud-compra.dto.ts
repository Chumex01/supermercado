import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateDetalleSolicitudCompraDto {
  @IsNotEmpty()
  @IsNumber()
  cantidad_solicitada: number;
  @IsNotEmpty()
  @IsString()
  justificacion: string;
  @IsNotEmpty()
  @IsNumber()
  solicitud_compra_id: number;
  @IsNotEmpty()
  @IsNumber()
  producto_id: number;
}
