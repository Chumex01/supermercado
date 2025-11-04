import { Module } from '@nestjs/common';
import { DetalleVentasController } from './detalle-ventas.controller';
import { DetalleVentasService } from './detalle-ventas.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetalleVenta } from './detalle-venta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DetalleVenta])], // <<-- entidad aquí
  controllers: [DetalleVentasController],
  providers: [DetalleVentasService],
  exports: [DetalleVentasService], // opcional si otro módulo necesita el servicio
})
export class DetalleVentaModule {}
