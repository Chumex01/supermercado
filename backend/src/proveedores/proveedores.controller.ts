import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { ProveedoresService } from './proveedores.service';

@Controller('proveedores')
export class ProveedoresController {
  constructor(private readonly proveedoresService: ProveedoresService) {}

  @Post()
  @ApiOperation({ summary: 'Crear proveedor' })
  async createProveedor(@Body() dtoProveedor: CreateProveedorDto) {
    const proveedor =
      await this.proveedoresService.createProveedor(dtoProveedor);
    return {
      message: 'Proveedor creado exitosamente',
      id_creado: proveedor.id,
      datos: proveedor,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Obtener proveedores' })
  getProveedores() {
    return this.proveedoresService.getProveedores();
  }
}
