// src/articulo/articulo.module.ts
import { Module } from '@nestjs/common';
import { EmpleadoController } from './empleado.controller';
import { EmpleadoService } from './empleado.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empleado } from './empleado.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Empleado])], // <<-- entidad aquí
  controllers: [EmpleadoController],
  providers: [EmpleadoService],
  exports: [EmpleadoService], // opcional si otro módulo necesita el servicio
})
export class EmpleadoModule {}
