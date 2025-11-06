import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
// import { EmpleadoService } from '../empleado/empleado.service';
import { CreateLoteDto } from './dto/create-lote.dto';
// import { CreateEmpleadoDto } from '../empleado/dto/create-empleado.dto';
import { LotesService } from './lotes.service';
@ApiTags('Lotes')
@Controller('lotes')
export class LotesController {
  constructor(private readonly loteService: LotesService) {}

  @Post('CrearLote')
  @ApiOperation({ summary: 'Crear un nuevo lote' })
  async crearLote(@Body() CreateLoteDto: CreateLoteDto) {
    const lote = await this.loteService.createLote(CreateLoteDto);
    return {
      message: 'Lote creado existosamente',
      lote_id: lote.id,
      datos: lote,
    };
  }

  @Get('ListarLotes')
  @ApiOperation({ summary: 'Obtener todos los lotes' })
  async listarLotes() {
    const lotes = await this.loteService.getLotes();
    return {
      total: lotes.length,
      data: lotes,
    };
  }
}
