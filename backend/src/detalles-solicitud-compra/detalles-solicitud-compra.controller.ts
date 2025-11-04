import { Body, Controller, Get, Post } from '@nestjs/common';
import { DetallesSolicitudCompraService } from './detalles-solicitud-compra.service';
import { CreateDetalleSolicitudCompraDto } from './dto/create-detalle-solicitud-compra.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('detalles-solicitud-compra')
export class DetallesSolicitudCompraController {
  constructor(
    private readonly detallesSolicitudCompraService: DetallesSolicitudCompraService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crea un detalle de solicitud de compra' })
  async createDetalleSolicitudCompra(
    @Body() createDetalleSolicitudCompraDto: CreateDetalleSolicitudCompraDto,
  ) {
    const detalleSolicitudCompra =
      await this.detallesSolicitudCompraService.createDetalleSolicitudCompra(
        createDetalleSolicitudCompraDto,
      );
    return {
      message: 'Detalle de solicitud de compra creado exitosamente',
      id_creado: detalleSolicitudCompra.id,
      datos: detalleSolicitudCompra,
    };
  }

  @Get()
  @ApiOperation({
    summary: 'Obtiene todos los detalles de solicitud de compra',
  })
  async getDetallesSolicitudCompra() {
    const detallesSolicitudCompra =
      await this.detallesSolicitudCompraService.getDetallesSolicitudCompra();
    return {
      message: 'Detalles de solicitud de compra obtenidos exitosamente',
      detallesSolicitudCompra,
    };
  }
}
