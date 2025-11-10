// src/ventas/ventas.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiQuery,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { VentasService } from './ventas.service';
import { CreateVentaDto } from './dto/create-ventas.dto';
import { EstadoVenta, Venta } from './venta.entity';

@ApiTags('ventas')
@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear una nueva venta',
    description: 'Crea una nueva venta y actualiza el stock automáticamente',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Venta creada exitosamente',
    type: Venta,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos inválidos o stock insuficiente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Sucursal, empleado o stock no encontrado',
  })
  async crearVenta(@Body() createVentaDto: CreateVentaDto) {
    const venta = await this.ventasService.crearVenta(createVentaDto);
    return {
      message: 'Venta creada exitosamente',
      data: venta,
    };
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las ventas',
    description:
      'Retorna una lista de todas las ventas con sus relaciones completas',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de ventas obtenida exitosamente',
    type: [Venta],
  })
  async obtenerTodasLasVentas() {
    const ventas = await this.ventasService.obtenerTodasLasVentas();
    return {
      message: 'Ventas obtenidas exitosamente',
      data: ventas,
      total: ventas.length,
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una venta por ID',
    description: 'Retorna los detalles completos de una venta específica',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID de la venta',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Venta encontrada',
    type: Venta,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Venta no encontrada',
  })
  async obtenerVentaPorId(@Param('id', ParseIntPipe) id: number) {
    const venta = await this.ventasService.obtenerVentaPorId(id);
    return {
      message: 'Venta obtenida exitosamente',
      data: venta,
    };
  }

  @Delete(':id/cancelar')
  @ApiOperation({
    summary: 'Cancelar una venta',
    description: 'Cancela una venta y revierte el stock si estaba completada',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID de la venta a cancelar',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Venta cancelada exitosamente',
    type: Venta,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'La venta ya está cancelada',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Venta no encontrada',
  })
  async cancelarVenta(@Param('id', ParseIntPipe) id: number) {
    const venta = await this.ventasService.cancelarVenta(id);
    return {
      message: 'Venta cancelada exitosamente',
      data: venta,
    };
  }

  @Get('sucursal/:sucursalId')
  @ApiOperation({
    summary: 'Obtener ventas por sucursal',
    description: 'Retorna todas las ventas de una sucursal específica',
  })
  @ApiParam({
    name: 'sucursalId',
    type: Number,
    description: 'ID de la sucursal',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ventas de la sucursal obtenidas exitosamente',
    type: [Venta],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Sucursal no encontrada',
  })
  async obtenerVentasPorSucursal(
    @Param('sucursalId', ParseIntPipe) sucursalId: number,
  ) {
    const ventas =
      await this.ventasService.obtenerVentasPorSucursal(sucursalId);
    return {
      message: `Ventas de la sucursal ${sucursalId} obtenidas exitosamente`,
      data: ventas,
      total: ventas.length,
    };
  }

  @Get('stock/disponible')
  @ApiOperation({
    summary: 'Obtener stock disponible por sucursal',
    description:
      'Retorna el stock disponible para ventas en una sucursal específica',
  })
  @ApiQuery({
    name: 'sucursalId',
    required: true,
    type: Number,
    description: 'ID de la sucursal',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Stock disponible obtenido exitosamente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Sucursal no encontrada',
  })
  async obtenerStockDisponible(
    @Query('sucursalId', ParseIntPipe) sucursalId: number,
  ) {
    const stock = await this.ventasService.obtenerStockDisponible(sucursalId);
    return {
      message: 'Stock disponible obtenido exitosamente',
      data: stock,
      total: stock.length,
    };
  }

  @Get('reporte/ganancias')
  @ApiOperation({
    summary: 'Obtener reporte de ventas con ganancias',
    description:
      'Genera un reporte detallado de ventas con cálculo de ganancias y márgenes',
  })
  @ApiQuery({
    name: 'sucursalId',
    required: false,
    type: Number,
    description: 'ID de la sucursal (opcional)',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reporte de ventas obtenido exitosamente',
  })
  async obtenerReporteVentas(
    @Query('sucursalId', new ParseIntPipe({ optional: true }))
    sucursalId?: number,
  ) {
    const reporte = await this.ventasService.obtenerReporteVentas(sucursalId);
    return {
      message: 'Reporte de ventas obtenido exitosamente',
      data: reporte,
      total: reporte.length,
      sucursal: sucursalId || 'Todas',
    };
  }

  @Get('estadisticas/resumen')
  @ApiOperation({
    summary: 'Obtener resumen estadístico de ventas',
    description: 'Retorna un resumen con estadísticas generales de ventas',
  })
  @ApiQuery({
    name: 'sucursalId',
    required: false,
    type: Number,
    description: 'ID de la sucursal (opcional)',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Resumen estadístico obtenido exitosamente',
  })
  async obtenerResumenEstadisticas(
    @Query('sucursalId', new ParseIntPipe({ optional: true }))
    sucursalId?: number,
  ) {
    const ventas = sucursalId
      ? await this.ventasService.obtenerVentasPorSucursal(sucursalId)
      : await this.ventasService.obtenerTodasLasVentas();

    const ventasCompletadas = ventas.filter(
      (v) => v.estado === EstadoVenta.COMPLETADA,
    );
    const totalVentas = ventasCompletadas.length;
    const totalIngresos = ventasCompletadas.reduce(
      (sum, venta) => sum + Number(venta.total),
      0,
    );
    const totalGanancias = ventasCompletadas.reduce(
      (sum, venta) => sum + venta.getGanancia(),
      0,
    );

    return {
      message: 'Resumen estadístico obtenido exitosamente',
      data: {
        totalVentas,
        totalIngresos,
        totalGanancias,
        promedioVenta: totalVentas > 0 ? totalIngresos / totalVentas : 0,
        margenGananciaPromedio:
          totalIngresos > 0 ? (totalGanancias / totalIngresos) * 100 : 0,
        sucursal: sucursalId || 'Todas',
      },
    };
  }
}
