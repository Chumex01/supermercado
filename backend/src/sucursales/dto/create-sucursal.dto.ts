import { IsNotEmpty, IsString } from 'class-validator';
// import { Type } from 'class-transformer';

export class CreateSucursalDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  direccion: string;

  @IsNotEmpty()
  @IsString()
  telefono: string;
}
