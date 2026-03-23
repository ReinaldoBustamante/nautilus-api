import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import basicAuth from 'express-basic-auth';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser())
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const originsString = process.env.CORS_ORIGINS || '';
  const allowedOrigins = originsString.split(',');

  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  app.use(
    ['/api'],
    basicAuth({
      users: {
        admin: '1234', // usuario: contraseña
      },
      challenge: true,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Centro Nautilus - API')
    .setDescription('A través de esta API es posible crear, consultar, actualizar y administrar la información relacionada con pacientes y profesionales. La API sigue el estándar OpenAPI 3.1 y utiliza formato JSON para el intercambio de datos. Está diseñada para integrarse con sistemas administrativos, aplicaciones móviles o plataformas externas que requieran acceso seguro a la información del servicio.')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'access-token', // nombre interno
    )
    .build()

  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, documentFactory)
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
