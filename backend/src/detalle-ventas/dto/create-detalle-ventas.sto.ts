import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateDetalleVentaDto {
    @IsNotEmpty()
    @IsNumber()
    cantidad: number;
    @IsNotEmpty()
    @IsNumber()
    precio_unitario: number;
    @IsNotEmpty()
    @IsNumber()
    subtotal: number;
    @IsNotEmpty()
    @IsNumber()
    venta_id: number;
    @IsNotEmpty()
    @IsNumber()
    lote_id: number;
}