// src/productos/productos.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './producto.entity';
import { CreateProductoDto, UnidadMedida } from './dto/create-producto.dto';
import { Categoria } from '../categorias/categoria.entity';
import { Proveedor } from '../proveedores/proveedor.entity';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  async createProducto(dto: CreateProductoDto) {
    // Crear el producto, mapeando las relaciones
    const producto = this.productoRepository.create({
      ...dto,
      categoria: { id: dto.categoriaId } as Categoria,
      proveedor: { id: dto.proveedorId } as Proveedor,
      unidad_medida: dto.unidad_medida || UnidadMedida.UNIDAD,
    });

    return this.productoRepository.save(producto);
  }

  async getProductos() {
    return this.productoRepository.find({
      relations: ['categoria', 'proveedor'],
    });
  }

  async getProductoById(id: number) {
    const producto = await this.productoRepository.findOne({
      where: { id },
      relations: ['categoria', 'proveedor'],
    });
    if (!producto) throw new NotFoundException('Producto no encontrado');
    return producto;
  }
}
