import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.setGlobalPrefix('api') // → todas las rutas comienzan con /api

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,  // elimina propiedades extra que lleguen en la peticion
      forbidNonWhitelisted: true, // lanza error si hay propiedades extra
    })
  );


  //Sirve para realizar la documentacion de la API desde Swagger
  const config = new DocumentBuilder()
    .setTitle('Inventario Restful API')
    .setDescription('Inventario endpoints')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);


  
  await app.listen(process.env.PORT ?? 3000);
  logger.log(`Application running on port ${process.env.PORT ?? 3000}`);
}
bootstrap();
