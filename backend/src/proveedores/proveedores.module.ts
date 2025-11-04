// src/articulo/articulo.module.ts
import { Module } from '@nestjs/common';
import { ProveedoresController } from './proveedores.controller';
import { ProveedoresService } from './proveedores.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proveedor } from './proveedor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Proveedor])], // <<-- entidad aquí
  controllers: [ProveedoresController],
  providers: [ProveedoresService],
  exports: [ProveedoresService], // opcional si otro módulo necesita el servicio
})
export class ProveedoresModule {}
