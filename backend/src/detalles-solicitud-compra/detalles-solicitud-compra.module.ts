// src/articulo/articulo.module.ts
import { Module } from '@nestjs/common';
import { DetallesSolicitudCompraController } from './detalles-solicitud-compra.controller';
import { DetallesSolicitudCompraService } from './detalles-solicitud-compra.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetalleSolicitudCompra } from './detalle-solicitud-compra.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DetalleSolicitudCompra])], // <<-- entidad aquí
  controllers: [DetallesSolicitudCompraController],
  providers: [DetallesSolicitudCompraService],
  exports: [DetallesSolicitudCompraService], // opcional si otro módulo necesita el servicio
})
export class DetallesSolicitudCompraModule {}
