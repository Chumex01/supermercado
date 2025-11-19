import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiParam } from '@nestjs/swagger';
import { CreateOrdenCompraDto } from './dto/create-orden-compra.dto';
import { OrdenesCompraService } from './ordenes-compra.service';
import { UpdateOrdenEstadoDto } from './dto/update-orden-estado.dto';

@Controller('ordenes-compra')
export class OrdenesCompraController {
  constructor(private readonly ordenesCompraService: OrdenesCompraService) {}

  @Post('CrearOrdenCompra')
  @ApiOperation({ summary: 'Crea una orden de compra' })
  async createOrdenCompra(@Body() createOrdenCompraDto: CreateOrdenCompraDto) {
    const ordenCompra =
      await this.ordenesCompraService.createOrdenCompra(createOrdenCompraDto);
    return {
      message: 'Orden de compra creada exitosamente',
      id_creado: ordenCompra.id,
      datos: ordenCompra,
    };
  }

  @Get('ListarOrdenesCompra')
  @ApiOperation({ summary: 'Obtiene todas las ordenes de compra' })
  async getOrdenesCompra() {
    const ordenesCompra = await this.ordenesCompraService.getOrdenesCompra();
    return {
      message: 'Ordenes de compra obtenidas exitosamente',
      ordenesCompra,
    };
  }

  @Patch(':id/estado')
  @ApiOperation({ summary: 'Actualizar estado de una orden de compra' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID de la orden de compra',
  })
  async updateOrdenEstado(
    @Param('id') id: number,
    @Body() updateOrdenEstadoDto: UpdateOrdenEstadoDto,
  ) {
    const ordenActualizada = await this.ordenesCompraService.updateOrdenEstado(
      id,
      updateOrdenEstadoDto,
    );
    return {
      message: 'Estado de orden actualizado exitosamente',
      orden: ordenActualizada,
    };
  }

  @Get('ultimo')
@ApiOperation({ summary: 'Obtener la última orden de compra registrada' })
async obtenerUltimaOrden() {
  const orden = await this.ordenesCompraService.getUltimaOrdenCompra();
  return {
    message: 'Última orden de compra obtenida correctamente',
    data: orden,
  };
}

}
