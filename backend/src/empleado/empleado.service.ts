import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empleado } from './empleado.entity';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { Usuario } from '../usuarios/usuario.entity';
import { Sucursal } from '../sucursales/sucursal.entity';
import { CreateEmpleadoAutoDto } from './dto/create-empleado-full.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EmpleadoService {
  constructor(
    @InjectRepository(Empleado)
    private readonly empleadoRepository: Repository<Empleado>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Sucursal)
    private readonly sucursalRepository: Repository<Sucursal>,
  ) {}

  async createEmpleado(dtoEmpleado: CreateEmpleadoDto) {
    const empleado = this.empleadoRepository.create({
      ...dtoEmpleado,
      usuario: { id: dtoEmpleado.usuario_id } as Usuario,
      sucursal: { id: dtoEmpleado.sucursal_id } as Sucursal,
    });

    return this.empleadoRepository.save(empleado);
  }

  async getEmpleados() {
    return this.empleadoRepository.find({
      relations: ['usuario', 'sucursal'],
    });
  }

  async crearEmpleadoAutomatico(dto: CreateEmpleadoAutoDto) {
    // 1️⃣ Validar sucursal existente
    const sucursalExiste = await this.sucursalRepository.findOne({
      where: { id: dto.sucursal_id },
    });

    if (!sucursalExiste) {
      throw new Error('La sucursal no existe');
    }

    // 2️⃣ Crear correo automático
    const correo = `${dto.nombres.toLowerCase()}.${dto.apellidos.toLowerCase()}@supermarket.com`;

    // 3️⃣ Crear contraseña automática (documento) y hacer hash
    const hashedPassword = await bcrypt.hash(dto.documento_identidad, 10);

    // 4️⃣ Crear usuario
    const usuario = this.usuarioRepository.create({
      correo,
      contrasena: hashedPassword, // ✅ ahora sí es hash seguro
    });

    const usuarioGuardado = await this.usuarioRepository.save(usuario);

    // 5️⃣ Crear empleado enlazando usuario
    const empleado = this.empleadoRepository.create({
      nombres: dto.nombres,
      apellidos: dto.apellidos,
      documento_identidad: dto.documento_identidad || undefined,
      telefono: dto.telefono || undefined,
      cargo: dto.cargo,
      fecha_contratacion: new Date(),
      sucursal: { id: dto.sucursal_id } as Sucursal,
      usuario: usuarioGuardado,
    });

    const empleadoGuardado = await this.empleadoRepository.save(empleado);

    return {
      message: 'Empleado y usuario creados automáticamente',
      empleado_id: empleadoGuardado.id,
      usuario_id: usuarioGuardado.id,
      correo_generado: correo,
    };
  }
}
