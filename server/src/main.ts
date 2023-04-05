import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { urlencoded, json } from 'express';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService)
  const CLIENT_URL = configService.get<string>("CLIENT_URL")
  const PORT = configService.get<string>("PORT")
  app.setGlobalPrefix('api');
  app.use(cookieParser())
  app.enableCors({ origin: CLIENT_URL, credentials: true, methods: ['GET', 'POST', 'PATCH', 'DELETE'] });
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  await app.listen(PORT || 3001);
  console.log(`\x1b[38;5;117m - running on port ${PORT} \x1b[0m`)
}
bootstrap();
