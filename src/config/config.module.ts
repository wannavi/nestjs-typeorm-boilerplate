import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import Joi from 'joi';

import appConfig from './app.config';
import databaseConfig from './database.config';

const validationSchema = Joi.object({
  // Application
  PORT: Joi.number().default(3100),

  // Database
  POSTGRES_HOST: Joi.string().required(),
  POSTGRES_PORT: Joi.number().default(5432),
  POSTGRES_DB: Joi.string().required(),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_SSL_CERT: Joi.string().allow(''),
});

@Module({
  imports: [
    NestConfigModule.forRoot({
      load: [appConfig, databaseConfig],
      validationSchema: validationSchema,
    }),
  ],
})
export class ConfigModule {}
