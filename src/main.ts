import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { Logger, ValidationPipe } from '@nestjs/common';
import {
  initializeTransactionalContext,
  patchTypeORMRepositoryWithBaseRepository,
} from 'typeorm-transactional-cls-hooked';
import helmet from 'helmet';
import compression from 'compression';

import { AppModule } from './app.module';
import { setupSwagger } from './setup-swagger';

const bootstrap = async () => {
  initializeTransactionalContext();
  patchTypeORMRepositoryWithBaseRepository();

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableShutdownHooks();

  // Middleware
  app.enableCors({ credentials: true });
  app.enableShutdownHooks();
  app.use(compression());
  app.use(helmet());

  // Pipes
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port');

  if (configService.get<boolean>('app.documentationEnabled')) {
    setupSwagger(app);
  }

  await app.listen(port);

  Logger.log(`🚀 Server is up and running!`);
};

bootstrap();
