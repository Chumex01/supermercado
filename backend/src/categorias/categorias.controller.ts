import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';

@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Post('CrearCategoria')
  @ApiOperation({ summary: 'Crear una categoria' })
  async createCategoria(@Body() createCategoriaDto: CreateCategoriaDto) {
    const categoria =
      await this.categoriasService.createCategoria(createCategoriaDto);
    return {
      message: 'Categoria creada exitosamente',
      id_creado: categoria.id,
      datos: categoria,
    };
  }

  @Get('ListarCategorias')
  @ApiOperation({ summary: 'Obtener todas las categorias' })
  listarCategorias() {
    return this.categoriasService.getCategorias();
  }
}
