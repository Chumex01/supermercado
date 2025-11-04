import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from './categoria.entity';
import { CreateCategoriaDto } from './dto/create-categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
  ) {}

  async createCategoria(dtoCategoria: CreateCategoriaDto) {
    const categoria = this.categoriaRepository.create(dtoCategoria);
    return this.categoriaRepository.save(categoria);
  }

  async getCategorias() {
    return this.categoriaRepository.find();
  }
}
