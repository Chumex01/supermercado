import { Body, Controller, Get, Post } from '@nestjs/common';
import { DetalleVentasService } from './detalle-ventas.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateDetalleVentaDto } from './dto/create-detalle-ventas.sto';

@Controller('detalle-ventas')
export class DetalleVentasController {
    constructor(private readonly detalleVentasService: DetalleVentasService){}

    @Post()
    @ApiOperation({summary: 'Crear detalle de venta'})
    async createDetalleVenta(@Body() createDetalleVentaDto: CreateDetalleVentaDto) {
        const DetalleVenta =
        await this.detalleVentasService.createDetalleVenta(createDetalleVentaDto);
        return{
            message: 'Detalle de venta creado exitosamente',
            id_creado: DetalleVenta.id,
            datos: DetalleVenta
        }
    }

    @Get()
    @ApiOperation({summary: 'Listar todos los detalles de venta'})
    async getDetalleVenta() {
        const detalleVenta= await this.detalleVentasService.getDetalleVenta();
        return{
            total: detalleVenta.length,
            data: detalleVenta,
        }
    }
}
