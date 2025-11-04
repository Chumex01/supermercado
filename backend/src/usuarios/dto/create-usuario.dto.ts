import { IsNotEmpty, IsString } from 'class-validator';
// import { Type } from 'class-transformer';

export class CreateUsuarioDto {
  @IsNotEmpty()
  @IsString()
  correo: string;

  @IsNotEmpty()
  @IsString()
  contrasena: string;
}
