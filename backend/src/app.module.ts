import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { UsuarioModule } from './usuarios/usuarios.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SucursalModule } from './sucursales/sucursales.module';
import { EmpleadoModule } from './empleado/empleado.module';
import { CategoriaModule } from './categorias/categorias.module';
import { ProveedoresModule } from './proveedores/proveedores.module';
import { ProductosModule } from './productos/productos.module';
import { SolicitudesCompraModule } from './solicitudes-compra/solicitudes-compra.module';
// import { DetallesSolicitudCompraModule } from './detalles-solicitud-compra/detalles-solicitud-compra.module';
import { OrdenesCompraModule } from './ordenes-compra/ordenes-compra.module';
// import { DetalleOrdenCompraModule } from './detalle-orden-compra/detalle-orden-compra.module';
import { LoteModule } from './lotes/lotes.module';
import { VentasModule } from './ventas/ventas.module';
import { StockModule } from './stock/stock.module';

@Module({
  imports: [
    //Servir la carpeta de imágenes
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'imagenes'),
    }),
    //Conexión con la base de datos
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '12345',
      database: 'supermercado',
      autoLoadEntities: true,
      synchronize: false,
    }),
    //Módulos
    UsuarioModule,
    SucursalModule,
    EmpleadoModule,
    CategoriaModule,
    ProveedoresModule,
    ProductosModule,
    SolicitudesCompraModule,
    // DetallesSolicitudCompraModule,
    OrdenesCompraModule,
    // DetalleOrdenCompraModule,
    LoteModule,
    StockModule,
    VentasModule,
  ],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
