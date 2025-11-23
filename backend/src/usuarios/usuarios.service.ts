import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  // INSERT con contraseña hasheada
  async createUsuario(dtoUsuario: CreateUsuarioDto) {
    // 🔐 Generamos el hash
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(dtoUsuario.contrasena, salt);

    // Reemplazamos contraseña en texto plano por el hash
    const usuario = this.usuarioRepository.create({
      ...dtoUsuario,
      contrasena: hashedPass,
    });

    return this.usuarioRepository.save(usuario);
  }

  // SELECT
  async getUsuarios() {
    return this.usuarioRepository.find();
  }

  async getUltimoUsuario() {
    const usuarios = await this.usuarioRepository.find({
      order: { id: 'DESC' },
      take: 1,
    });

    return usuarios[0] ?? null;
  }

  async login(correo: string, contrasena: string) {
    // Buscamos al usuario incluyendo la contraseña (por si tuvieras select: false)
    const usuario = await this.usuarioRepository.findOne({
      where: { correo },
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // 🔐 Comparamos contraseña ingresada vs hash guardado
    const passwordValida = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!passwordValida) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return {
      usuario: { id: usuario.id, correo: usuario.correo },
    };
  }
}
