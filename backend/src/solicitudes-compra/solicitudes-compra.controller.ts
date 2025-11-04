import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateSolicitudCompraDto } from './dto/create-solicitudes-compra.dto';
import { SolicitudesCompraService } from './solicitudes-compra.service';

@ApiTags('solicitudes-compra')
@Controller('solicitudes-compra')
export class SolicitudesCompraController {
  constructor(
    private readonly solicitudesCompraService: SolicitudesCompraService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear una solicitud de compra' })
  async createSolicitudCompra(
    @Body() createSolicitudCompraDto: CreateSolicitudCompraDto,
  ) {
    const solicitudCompra =
      await this.solicitudesCompraService.createSolicitudCompra(
        createSolicitudCompraDto,
      );
    return {
      message: 'Solicitud de compra creada exitosamente',
      id_creado: solicitudCompra.id,
      empleado_solicitante_id: createSolicitudCompraDto.empleado_solicitante_id,
      sucursal_id: createSolicitudCompraDto.sucursal_id,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las solicitudes de compra' })
  async getSolicitudesCompra() {
    const solicitudesCompra =
      await this.solicitudesCompraService.getSolicitudesCompra();
    return {
      message: 'Solicitudes de compra obtenidas exitosamente',
      solicitudesCompra,
    };
  }
}
