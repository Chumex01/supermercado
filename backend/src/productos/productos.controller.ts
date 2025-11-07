// src/productos/productos.controller.ts
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateProductoDto } from './dto/create-producto.dto';
import { ProductosService } from './productos.service';

@ApiTags('Productos')
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post('CrearProducto')
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  async crearProducto(@Body() createProductoDto: CreateProductoDto) {
    const productoCreado =
      await this.productosService.createProducto(createProductoDto);
    return {
      message: 'Producto creado exitosamente',
      producto_id: productoCreado.id,
      nombre: productoCreado.nombre,
    };
  }

  @Get('ListarProductos')
  @ApiOperation({ summary: 'Listar todos los productos' })
  async listarProductos() {
    const productos = await this.productosService.getProductos();
    return {
      total: productos.length,
      data: productos,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por ID' })
  async obtenerProducto(@Param('id') id: number) {
    const producto = await this.productosService.getProductoById(+id);
    return producto;
  }
}
