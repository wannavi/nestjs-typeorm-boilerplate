import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<TypeOrmModuleOptions> => ({
        type: 'postgres',
        host: configService.get<string>('postgres.host'),
        port: configService.get<number>('postgres.port'),
        username: configService.get<string>('postgres.username'),
        password: configService.get<string>('postgres.password'),
        database: configService.get<string>('postgres.database'),
        synchronize: true,
        entities: [join(__dirname, '../../**/*.entity.ts')],
        ssl: configService.get<string>('postgres.certificate') && {
          ca: Buffer.from(
            configService.get<string>('postgres.certificate'),
            'base64',
          ).toString('ascii'),
        },
        migrations: [join(__dirname, './migrations/*{.ts,.js}')],
      }),
    }),
  ],
})
export class DatabaseModule {}
