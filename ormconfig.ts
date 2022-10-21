/**
 * @url
 * https://stackoverflow.com/questions/59913475/configure-typeorm-with-one-configuration-for-cli-and-nestjs-application
 */
import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';

import databaseConfig from './src/config/database.config';

ConfigModule.forRoot({
  isGlobal: true,
  load: [databaseConfig],
});

const dbConfig = databaseConfig();
const dataSource = new DataSource({ type: 'postgres', ...dbConfig });

export default dataSource;
