import { Module } from '@nestjs/common';
import { DetalleVentasController } from './detalle-ventas.controller';
import { DetalleVentasService } from './detalle-ventas.service';

@Module({
  controllers: [DetalleVentasController],
  providers: [DetalleVentasService]
})
export class DetalleVentasModule {}
