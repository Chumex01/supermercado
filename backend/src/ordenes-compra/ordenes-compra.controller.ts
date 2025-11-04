import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CreateOrdenCompraDto } from './dto/create-orden-compra.dto';
import { OrdenesCompraService } from './ordenes-compra.service';

@Controller('ordenes-compra')
export class OrdenesCompraController {
  constructor(private readonly ordenesCompraService: OrdenesCompraService) {}

  @Post()
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

  @Get()
  @ApiOperation({ summary: 'Obtiene todas las ordenes de compra' })
  async getOrdenesCompra() {
    const ordenesCompra = await this.ordenesCompraService.getOrdenesCompra();
    return {
      message: 'Ordenes de compra obtenidas exitosamente',
      ordenesCompra,
    };
  }
}
