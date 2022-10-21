import 'dotenv/config';

import { DataSource } from 'typeorm';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  port: parseInt(process.env.POSTGRES_PORT, 10),
  migrations: [__dirname + '/src/database/mirgrations'],
  entities: [__dirname + '/src/**/*.entity{.ts,.js}'],
});

export default dataSource;
