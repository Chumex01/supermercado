import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}
  //INSERT
  async createUsuario(dtoUsuario: CreateUsuarioDto) {
    const usuario = this.usuarioRepository.create(dtoUsuario);
    return this.usuarioRepository.save(usuario);
  }
  //SELECT
  async getUsuarios() {
    return this.usuarioRepository.find();
  }
}
