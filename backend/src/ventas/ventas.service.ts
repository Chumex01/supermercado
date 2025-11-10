// src/ventas/ventas.service.ts
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venta, EstadoVenta } from './venta.entity';
import { CreateVentaDto } from './dto/create-ventas.dto';
import { Stock } from '../stock/stock.entity';
import { Sucursal } from '../sucursales/sucursal.entity';
import { Empleado } from '../empleado/empleado.entity';
import { EstadoLote } from '../lotes/lote.entity';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private readonly ventaRepository: Repository<Venta>,
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
    @InjectRepository(Sucursal)
    private readonly sucursalRepository: Repository<Sucursal>,
    @InjectRepository(Empleado)
    private readonly empleadoRepository: Repository<Empleado>,
  ) {}

  async crearVenta(createVentaDto: CreateVentaDto): Promise<Venta> {
    // Validar entidades relacionadas
    const sucursal = await this.sucursalRepository.findOneBy({
      id: createVentaDto.sucursal_id,
    });
    if (!sucursal) {
      throw new NotFoundException('Sucursal no encontrada');
    }

    const empleado = await this.empleadoRepository.findOneBy({
      id: createVentaDto.empleado_cajero_id,
    });
    if (!empleado) {
      throw new NotFoundException('Empleado no encontrado');
    }

    const stock = await this.stockRepository.findOne({
      where: { id: createVentaDto.stock_id },
      relations: ['sucursal', 'lote', 'lote.producto'],
    });
    if (!stock) {
      throw new NotFoundException('Stock no encontrado');
    }

    // Validaciones de negocio
    if (stock.sucursal.id !== createVentaDto.sucursal_id) {
      throw new BadRequestException(
        'El stock no pertenece a la sucursal seleccionada',
      );
    }

    if (Number(stock.cantidad_disponible) < Number(createVentaDto.cantidad)) {
      throw new BadRequestException(
        `Stock insuficiente. Disponible: ${stock.cantidad_disponible}, Solicitado: ${createVentaDto.cantidad}`,
      );
    }

    if (stock.lote.estado !== EstadoLote.ACTIVO) {
      throw new BadRequestException('El lote no está activo');
    }

    // Crear venta
    const venta = this.ventaRepository.create({
      sucursal,
      empleado_cajero: empleado,
      stock,
      cantidad: createVentaDto.cantidad,
      precio_unitario: createVentaDto.precio_unitario,
      metodo_pago: createVentaDto.metodo_pago,
    });

    venta.completarVenta();

    // Actualizar stock
    stock.cantidad_disponible =
      Number(stock.cantidad_disponible) - Number(createVentaDto.cantidad);
    stock.fecha_actualizacion = new Date();
    await this.stockRepository.save(stock);

    return await this.ventaRepository.save(venta);
  }

  async obtenerTodasLasVentas(): Promise<Venta[]> {
    return this.ventaRepository.find({
      relations: [
        'sucursal',
        'empleado_cajero',
        'stock',
        'stock.lote',
        'stock.lote.producto',
        'stock.lote.producto.categoria',
        'stock.lote.producto.proveedor',
      ],
      order: { fecha_creacion: 'DESC' },
    });
  }

  async obtenerVentaPorId(id: number): Promise<Venta> {
    const venta = await this.ventaRepository.findOne({
      where: { id },
      relations: [
        'sucursal',
        'empleado_cajero',
        'stock',
        'stock.lote',
        'stock.lote.producto',
        'stock.lote.producto.categoria',
        'stock.lote.producto.proveedor',
      ],
    });

    if (!venta) {
      throw new NotFoundException(`Venta con ID ${id} no encontrada`);
    }

    return venta;
  }

  async cancelarVenta(id: number): Promise<Venta> {
    const venta = await this.obtenerVentaPorId(id);

    // CORREGIDO: Usando el enum EstadoVenta
    if (venta.estado === EstadoVenta.CANCELADA) {
      throw new BadRequestException('La venta ya está cancelada');
    }

    // CORREGIDO: Usando el enum EstadoVenta
    if (venta.estado === EstadoVenta.COMPLETADA) {
      const stock = venta.stock;
      stock.cantidad_disponible =
        Number(stock.cantidad_disponible) + Number(venta.cantidad);
      stock.fecha_actualizacion = new Date();
      await this.stockRepository.save(stock);
    }

    venta.cancelarVenta();
    return await this.ventaRepository.save(venta);
  }

  async obtenerVentasPorSucursal(sucursalId: number): Promise<Venta[]> {
    const sucursal = await this.sucursalRepository.findOneBy({
      id: sucursalId,
    });
    if (!sucursal) {
      throw new NotFoundException('Sucursal no encontrada');
    }

    return this.ventaRepository.find({
      where: { sucursal: { id: sucursalId } },
      relations: [
        'sucursal',
        'empleado_cajero',
        'stock',
        'stock.lote',
        'stock.lote.producto',
      ],
      order: { fecha_creacion: 'DESC' },
    });
  }

  async obtenerStockDisponible(sucursalId: number): Promise<Stock[]> {
    const sucursal = await this.sucursalRepository.findOneBy({
      id: sucursalId,
    });
    if (!sucursal) {
      throw new NotFoundException('Sucursal no encontrada');
    }

    return this.stockRepository
      .createQueryBuilder('stock')
      .leftJoinAndSelect('stock.lote', 'lote')
      .leftJoinAndSelect('lote.producto', 'producto')
      .leftJoinAndSelect('producto.categoria', 'categoria')
      .leftJoinAndSelect('producto.proveedor', 'proveedor')
      .where('stock.sucursal_id = :sucursalId', { sucursalId })
      .andWhere('stock.cantidad_disponible > 0')
      .andWhere('lote.estado = :estado', { estado: EstadoLote.ACTIVO })
      .orderBy('producto.nombre', 'ASC')
      .getMany();
  }

  async obtenerReporteVentas(sucursalId?: number): Promise<any[]> {
    const ventas = sucursalId
      ? await this.obtenerVentasPorSucursal(sucursalId)
      : await this.obtenerTodasLasVentas();

    // CORREGIDO: Usando el enum EstadoVenta
    const ventasCompletadas = ventas.filter(
      (venta) => venta.estado === EstadoVenta.COMPLETADA,
    );

    return ventasCompletadas.map((venta) => ({
      ...venta.getInfoVenta(),
      ganancia: venta.getGanancia(),
      costoUnitario: venta.getCostoUnitario(),
      margenGanancia:
        ((venta.getGanancia() / venta.total) * 100).toFixed(2) + '%',
    }));
  }
}
