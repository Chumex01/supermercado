// src/ventas/ventas.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VentasService } from './ventas.service';
import { VentasController } from './ventas.controller';
import { Venta } from './venta.entity';
import { Stock } from '../stock/stock.entity';
import { Sucursal } from '../sucursales/sucursal.entity';
import { Empleado } from '../empleado/empleado.entity';
import { Lote } from '../lotes/lote.entity';
import { Producto } from '../productos/producto.entity';
import { Categoria } from '../categorias/categoria.entity';
import { Proveedor } from '../proveedores/proveedor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      // Entidades principales del módulo de ventas
      Venta,
      // Entidades relacionadas necesarias para las ventas
      Stock,
      Sucursal,
      Empleado,
      Lote,
      Producto,
      Categoria,
      Proveedor,
    ]),
  ],
  controllers: [VentasController],
  providers: [VentasService],
  exports: [VentasService],
})
export class VentasModule {}
