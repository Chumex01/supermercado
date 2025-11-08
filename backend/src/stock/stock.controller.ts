import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { StockService } from './stock.service';
import { CreateStockDto } from './dto/create-stock.dto';

@ApiTags('Stocks')
@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post('CrearStock')
  @ApiOperation({ summary: 'Crear nuevo Stock' })
  async crearStock(@Body() CreateStockDto: CreateStockDto) {
    const stockCreado = await this.stockService.createStock(CreateStockDto);
    return {
      message: 'Stock creado exitosamente',
      stock_id: stockCreado.id,
      datos: stockCreado,
    };
  }

  @Get('ListarStocks')
  @ApiOperation({ summary: 'Listar todos los stocks' })
  async listarStock() {
    const stocks = await this.stockService.getStocks();
    return {
      total: stocks.length,
      data: stocks,
    };
  }
}
