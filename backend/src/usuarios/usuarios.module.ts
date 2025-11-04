// src/articulo/articulo.module.ts
import { Module } from '@nestjs/common';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])], // <<-- entidad aquí
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService], // opcional si otro módulo necesita el servicio
})
export class UsuarioModule {}
