import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator"
import { MetodoPago } from "../venta.entity";

export class CreateVentaDto {
    @IsNotEmpty()
    @IsNumber()
    total: number
    @IsNotEmpty()
    @IsEnum(MetodoPago)
    metodo_pago: MetodoPago;
    @IsNotEmpty()
    @IsNumber()
    sucursal_id: number
    @IsNotEmpty()
    @IsNumber()
    empleado_cajero_id: number
}