import { Body, Controller, Get, Post } from '@nestjs/common';
import { SucursalesService } from './sucursales.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateSucursalDto } from './dto/create-sucursal.dto';

@Controller('sucursales')
export class SucursalesController {
  constructor(private readonly sucursalesService: SucursalesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  async crearUsuario(@Body() createSucursalDto: CreateSucursalDto) {
    const sucursal =
      await this.sucursalesService.createSucursal(createSucursalDto);
    return {
      message: 'Sucursal creada exitosamente',
      id_creado: sucursal.id,
      nombre: sucursal.nombre,
      datos: sucursal,
    };
  }

  @Get('ListarSucursal')
  @ApiOperation({ summary: 'Listar Sucursal' })
  listarSucursal() {
    return this.sucursalesService.getSucursales();
  }
}
