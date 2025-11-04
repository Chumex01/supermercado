import { Controller, Post, Body } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { LoginUsuarioDto } from './dto/login-usuario.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post('login')
  async login(@Body() loginDto: LoginUsuarioDto) {
    return this.usuariosService.login(loginDto.correo, loginDto.contrasena);
  }
}
