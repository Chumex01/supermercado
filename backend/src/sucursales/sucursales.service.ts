import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sucursal } from './sucursal.entity';
import { Repository } from 'typeorm';
import { CreateSucursalDto } from './dto/create-sucursal.dto';

@Injectable()
export class SucursalesService {
  constructor(
    @InjectRepository(Sucursal)
    private readonly sucursalRepository: Repository<Sucursal>,
  ) {}
  //INSERT
  async createSucursal(dtoSucursal: CreateSucursalDto) {
    const sucursal = this.sucursalRepository.create(dtoSucursal);
    return this.sucursalRepository.save(sucursal);
  }
  //SELECT
  async getSucursales() {
    return this.sucursalRepository.find();
  }
}
