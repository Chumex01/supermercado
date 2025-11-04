import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateLoteDto{
    @IsNotEmpty()
    @IsString()
    numero_lote: string;
    @IsNotEmpty()
    @IsString()
    fecha_vencimiento: string;
    @IsNotEmpty()
    @IsNumber()
    cantidad_recibida: number;
    @IsNotEmpty()
    @IsNumber()
    costo_unitario: number;
    @IsNotEmpty()
    @IsNumber()
    orden_compra_id: number;
    @IsNotEmpty()
    @IsNumber()
    producto_id: number;
}