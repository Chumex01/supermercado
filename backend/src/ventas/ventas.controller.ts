import { Body, Controller, Get, Post } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateVentaDto } from './dto/create-ventas.dto';

@Controller('ventas')
export class VentasController {
    constructor(private readonly ventaService: VentasService) {}

    @Post()
    @ApiOperation({summary: 'Crear una nueva venta'})
    async crearVenta(@Body() createVentaDto: CreateVentaDto) {
        const venta = await this.ventaService.createVenta(createVentaDto);
        return {
            message: 'Venta creada exitosamente',
            id_creado: venta.id,
            datos: venta,
        }
    }

    @Get()
    @ApiOperation({summary: 'Obtener todas las ventas'})
    async obtenerVentas() {
        const ventas = await this.ventaService.getVentas();
        return {
            total: ventas.length,
            data: ventas
        }
    }
}
