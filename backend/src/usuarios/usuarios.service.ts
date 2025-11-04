import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
// import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    // private readonly jwtService: JwtService, // ✅ inyectado aquí
  ) {}

  // INSERT
  async createUsuario(dtoUsuario: CreateUsuarioDto) {
    const usuario = this.usuarioRepository.create(dtoUsuario);
    return this.usuarioRepository.save(usuario);
  }

  // SELECT
  async getUsuarios() {
    return this.usuarioRepository.find();
  }

  async login(correo: string, contrasena: string) {
    const usuario = await this.usuarioRepository.findOne({ where: { correo } });
    if (!usuario || usuario.contrasena !== contrasena) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // No JWT, solo devolvemos el usuario
    return {
      usuario: { id: usuario.id, correo: usuario.correo },
    };
  }
}
