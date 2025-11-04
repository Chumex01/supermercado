import { Body, Controller, Post, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { DetalleOrdenCompraService } from './detalle-orden-compra.service';
import { CreateDetalleOrdeCompraDto } from './dto/create-detalle-orden-compra.dto';

@Controller('detalle-orden-compra')
export class DetalleOrdenCompraController {
  constructor(
    private readonly detalleOrdenCompraService: DetalleOrdenCompraService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear detalle de orden de compra' })
  async createDetalleOrdenCompra(
    @Body() createDetalleOrdenCompraDto: CreateDetalleOrdeCompraDto,
  ) {
    const detalleOrdenCompra =
      await this.detalleOrdenCompraService.createDetalleOrdenCompra(
        createDetalleOrdenCompraDto,
      );

    return {
      message: 'Detalle de orden de compra creado exitosamente',
      id_creado: detalleOrdenCompra.id,
      datos: detalleOrdenCompra,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los detalles de orden de compra' })
  async getDetallesOrdenCompra() {
    const detallesOrdenCompra =
      await this.detalleOrdenCompraService.getDetallesOrdenCompra();
    return {
      message: 'Detalles de orden de compra obtenidos exitosamente',
      detallesOrdenCompra,
    };
  }
}
