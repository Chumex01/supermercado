import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUsuarioDto {
  @IsNotEmpty()
  @IsString()
  correo: string;

  @IsNotEmpty()
  @IsString()
  contrasena: string;
}
