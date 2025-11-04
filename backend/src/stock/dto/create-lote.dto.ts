import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateStockDto {
    @IsNotEmpty()
    @IsNumber()
    cantidad_disponible: number
    @IsNotEmpty()
    @IsNumber()
    cantidad_minima: number
    @IsNotEmpty()
    @IsString()
    ubicacion: string
    @IsNotEmpty()
    @IsNumber()
    sucursal_id: number
    @IsNotEmpty()
    @IsNumber()
    producto_id: number
    @IsNotEmpty()
    @IsNumber()
    lote_id: number
}