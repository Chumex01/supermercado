import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateSolicitudCompraDto } from './dto/create-solicitudes-compra.dto';
import { SolicitudesCompraService } from './solicitudes-compra.service';
import { UpdateSolicitudEstadoDto } from './dto/update-solicitud-estado.dto';

@ApiTags('solicitudes-compra')
@Controller('solicitudes-compra')
export class SolicitudesCompraController {
  constructor(
    private readonly solicitudesCompraService: SolicitudesCompraService,
  ) {}

  @Post('CrearSolicitudCompra')
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
      empleado_id: createSolicitudCompraDto.empleado_id,
      sucursal_id: createSolicitudCompraDto.sucursal_id,
      producto_id: createSolicitudCompraDto.producto_id,
    };
  }

  @Get('ListarSolicitudesCompra')
  @ApiOperation({ summary: 'Obtener todas las solicitudes de compra' })
  async getSolicitudesCompra() {
    const solicitudesCompra =
      await this.solicitudesCompraService.getSolicitudesCompra();
    return {
      message: 'Solicitudes de compra obtenidas exitosamente',
      solicitudesCompra,
    };
  }

  // ✅ AGREGAR ESTE NUEVO ENDPOINT
  @Patch(':id/estado')
  @ApiOperation({ summary: 'Actualizar estado de una solicitud' })
  async updateSolicitudEstado(
    @Param('id') id: number,
    @Body() updateSolicitudEstadoDto: UpdateSolicitudEstadoDto,
  ) {
    const solicitudActualizada =
      await this.solicitudesCompraService.updateEstado(
        +id,
        updateSolicitudEstadoDto.estado,
      );
    return {
      message: 'Estado de solicitud actualizado exitosamente',
      datos: solicitudActualizada,
    };
  }
}
