import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { EmpleadoService } from './empleado.service';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { CreateEmpleadoAutoDto } from './dto/create-empleado-full.dto';

@ApiTags('Empleados')
@Controller('empleados')
export class EmpleadoController {
  constructor(private readonly empleadoService: EmpleadoService) {}

  @Post('CrearEmpleado')
  @ApiOperation({ summary: 'Crear un nuevo empleado' })
  async crearEmpleado(@Body() createEmpleadoDto: CreateEmpleadoDto) {
    const empleadoCreado =
      await this.empleadoService.createEmpleado(createEmpleadoDto);
    return {
      message: 'Empleado creado exitosamente',
      empleado_id: empleadoCreado.id,
      nombres: empleadoCreado.nombres,
      apellidos: empleadoCreado.apellidos,
    };
  }

  @Get('ListarEmpleados')
  @ApiOperation({ summary: 'Listar todos los empleados' })
  async listarEmpleados() {
    const empleados = await this.empleadoService.getEmpleados();
    return {
      total: empleados.length,
      data: empleados,
    };
  }

  @Post('CrearEmpleadoAutomatico')
  @ApiOperation({ summary: 'Crear Usuario + Empleado automáticamente' })
  async crearEmpleadoAutomatico(@Body() dto: CreateEmpleadoAutoDto) {
    return this.empleadoService.crearEmpleadoAutomatico(dto);
  }
}
