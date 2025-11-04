import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { Proveedor } from './proveedor.entity';

@Injectable()
export class ProveedoresService {
  constructor(
    @InjectRepository(Proveedor)
    private readonly proveedorRepository: Repository<Proveedor>,
  ) {}

  async createProveedor(dtoProveedor: CreateProveedorDto) {
    const proveedor = this.proveedorRepository.create(dtoProveedor);
    return this.proveedorRepository.save(proveedor);
  }

  async getProveedores() {
    return this.proveedorRepository.find();
  }
}
