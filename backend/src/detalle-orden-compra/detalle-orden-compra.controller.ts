import { Body, Controller, Post, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DetalleOrdenCompraService } from './detalle-orden-compra.service';
import { CreateDetalleOrdenCompraDto } from './dto/create-detalle-orden-compra.dto';

@ApiTags('detalle-orden-compra')
@Controller('detalle-orden-compra')
export class DetalleOrdenCompraController {
  constructor(
    private readonly detalleOrdenCompraService: DetalleOrdenCompraService,
  ) {}

  @Post('CrearDetalleOrdenCompra')
  @ApiOperation({ summary: 'Crear detalle de orden de compra' })
  async createDetalleOrdenCompra(@Body() dto: CreateDetalleOrdenCompraDto) {
    const detalle =
      await this.detalleOrdenCompraService.createDetalleOrdenCompra(dto);

    return {
      message: 'Detalle de orden de compra creado exitosamente',
      id_creado: detalle.id,
      datos: detalle,
    };
  }

  @Get('ObtenerDetallesOrdenCompra')
  @ApiOperation({ summary: 'Obtener todos los detalles de orden de compra' })
  async getDetallesOrdenCompra() {
    const detalles =
      await this.detalleOrdenCompraService.getDetallesOrdenCompra();
    return {
      message: 'Detalles de orden de compra obtenidos exitosamente',
      detallesOrdenCompra: detalles,
    };
  }
}
