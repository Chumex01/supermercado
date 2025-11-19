import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) { }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  async crearUsuario(@Body() createUsuarioDto: CreateUsuarioDto) {
    const usuario = await this.usuariosService.createUsuario(createUsuarioDto);
    return {
      message: 'Usuario creado exitosamente',
      id_creado: usuario.id,
      datos: usuario,
    };
  }

  @Get('ListarUsuario')
  @ApiOperation({ summary: 'Listar Usuario' })
  listarUsuario() {
    return this.usuariosService.getUsuarios();
  }

  @Get('ultimo')
  @ApiOperation({ summary: 'Obtener el último usuario registrado' })
  getUltimoUsuario() {
    return this.usuariosService.getUltimoUsuario();
  }

}
