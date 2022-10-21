import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import Joi from 'joi';

import appConfig from './app.config';

const validationSchema = Joi.object({
  PORT: Joi.number().default(3100),
});

@Module({
  imports: [
    NestConfigModule.forRoot({
      load: [appConfig],
      validationSchema: validationSchema,
    }),
  ],
})
export class ConfigModule {}
