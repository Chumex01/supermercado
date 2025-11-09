import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proveedor } from '../proveedores/proveedor.entity';
import { SolicitudCompra } from '../solicitudes-compra/solicitud-compra.entity';
import { CreateOrdenCompraDto } from './dto/create-orden-compra.dto';
import { OrdenCompra } from './orden-compra.entity';
import { UpdateOrdenEstadoDto } from './dto/update-orden-estado.dto';

@Injectable()
export class OrdenesCompraService {
  constructor(
    @InjectRepository(OrdenCompra)
    private readonly ordenCompraRepository: Repository<OrdenCompra>,
  ) {}

  async createOrdenCompra(dto: CreateOrdenCompraDto) {
    const ordenCompra = this.ordenCompraRepository.create({
      nombre_orden: dto.nombre_orden,
      precio_unitario: dto.precio_unitario,
      cantidad_ordenada: dto.cantidad_ordenada,
      // ✅ CORREGIR: Solo pasar los IDs, TypeORM maneja las relaciones
      solicitud_id: { id: dto.solicitud_id } as SolicitudCompra,
      proveedor_id: { id: dto.proveedor_id } as Proveedor,
    });

    console.log('📝 Creando orden:', ordenCompra); // ← Debug
    return this.ordenCompraRepository.save(ordenCompra);
  }

  async getOrdenesCompra() {
    return this.ordenCompraRepository.find({
      relations: ['solicitud_id', 'proveedor_id'], // ← Nombres EXACTOS de tu entidad
    });
  }

  async updateOrdenEstado(id: number, dto: UpdateOrdenEstadoDto) {
    const orden = await this.ordenCompraRepository.findOne({
      where: { id },
    });

    if (!orden) {
      throw new NotFoundException(`Orden de compra con ID ${id} no encontrada`);
    }

    // Actualizar solo el estado
    orden.estado = dto.estado;

    return await this.ordenCompraRepository.save(orden);
  }
}
