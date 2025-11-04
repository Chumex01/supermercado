// src/articulo/articulo.module.ts
import { Module } from '@nestjs/common';
import { CategoriasController } from './categorias.controller';
import { CategoriasService } from './categorias.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categoria } from './categoria.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Categoria])], // <<-- entidad aquí
  controllers: [CategoriasController],
  providers: [CategoriasService],
  exports: [CategoriasService], // opcional si otro módulo necesita el servicio
})
export class CategoriaModule {}
