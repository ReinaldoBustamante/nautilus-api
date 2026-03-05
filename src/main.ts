import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser())

  const originsString = process.env.CORS_ORIGINS || '';
  const allowedOrigins = originsString.split(',');

  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
