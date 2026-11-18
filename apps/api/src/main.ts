import { NestFactory } from "@nestjs/core";
import { ValidationPipe, Logger } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./common/filters/http-exception.filter";
import { TransformInterceptor } from "./common/interceptors/transform.interceptor";

async function bootstrap() {
  const logger = new Logger("Bootstrap");
  const app = await NestFactory.create(AppModule);

  // Security Headers
  app.use(helmet());

  // Cookie parsing for HttpOnly refresh tokens
  app.use(cookieParser());

  // CORS configuration
  app.enableCors({
    origin: process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(",")
      : ["http://localhost:3000"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
  });

  // Global Prefix
  app.setGlobalPrefix("api/v1");

  // Global Pipelines
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger / OpenAPI documentation
  const config = new DocumentBuilder()
    .setTitle("Ana Orthodox API")
    .setDescription("The Coptic Orthodox Digital Platform REST API Specification")
    .setVersion("1.0.0")
    .addTag("Health", "Subsystem readiness and health verification")
    .addTag("Holy Bible", "Canonical Scriptures and Chapters")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  const port = process.env.API_PORT || 3001;
  await app.listen(port);
  logger.log(`Ana Orthodox API is operating on port ${port} (Prefix: /api/v1)`);
  logger.log(`Swagger OpenAPI Documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
