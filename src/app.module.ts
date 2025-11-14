import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MobilesModule } from './mobiles/mobiles.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
     ServeStaticModule.forRoot({
          rootPath: join(__dirname, '..', 'public'), // Sirve para configurar la carpeta desde donde se serviran los archivos estaticos
    }),
    MobilesModule,
    ConfigModule.forRoot(), //Sirve para cargar las variables de entorno .env
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!,
      username: process.env.DB_USERNAME,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true, // Carga todas las entidades que se vayan creando
      synchronize: true, // Cambiar cuando se pase a produccion 
    }),
    MobilesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
