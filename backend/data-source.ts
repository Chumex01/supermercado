import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '12345',
  database: 'supermercado',
  synchronize: true, // True solo en desarrollo
  logging: true,
  entities: ['dist/**/*.entity.js'], // En desarrollo, TS sin compilar
  migrations: ['src/migrations/*.ts'],
});

export default AppDataSource;
