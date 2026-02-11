import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { bootstrapSuperAdmin } from './bootstrap/super-admin.bootstrap';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Dynamic CORS (future-proof)
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = (process.env.CORS_ORIGINS || '')
        .split(',')
        .map(o => o.trim());

      // Allow server-to-server / Postman / mobile apps
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await bootstrapSuperAdmin();

  const port = process.env.PORT || 3003;
  await app.listen(port);

  console.log(`🚀 TeleCRM Backend running on http://localhost:${port}`);
}

void bootstrap();


