import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security
  app.use(helmet());
  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global response wrapper: { success: true, data: ... }
  app.useGlobalInterceptors(new TransformInterceptor());

  // Global exception filter: consistent error shape
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('Emaar Platform API')
    .setDescription('API documentation for the Emaar construction platform')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication & OTP')
    .addTag('users', 'User management')
    .addTag('projects', 'Project management')
    .addTag('milestones', 'Milestone tracking')
    .addTag('escrow', 'Payment & Escrow')
    .addTag('marketplace', 'Products & Stores')
    .addTag('orders', 'Order management')
    .addTag('chat', 'Real-time messaging')
    .addTag('notifications', 'Push & in-app notifications')
    .addTag('quality', 'Quality assurance')
    .addTag('disputes', 'Dispute resolution')
    .addTag('admin', 'Admin operations')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.warn(`🚀 Emaar API running on port ${port}`);
  console.warn(`📚 Swagger docs: http://localhost:${port}/api/docs`);
}

bootstrap();
