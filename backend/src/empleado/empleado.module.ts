// src/articulo/articulo.module.ts
import { Module } from '@nestjs/common';
import { EmpleadoController } from './empleado.controller';
import { EmpleadoService } from './empleado.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empleado } from './empleado.entity';
import { Sucursal } from '../sucursales/sucursal.entity';
import { Usuario } from '../usuarios/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Empleado, Usuario, Sucursal])], // <<-- entidad aquí
  controllers: [EmpleadoController],
  providers: [EmpleadoService],
  exports: [EmpleadoService], // opcional si otro módulo necesita el servicio
})
export class EmpleadoModule {}
