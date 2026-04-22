import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const walletError = errors.find((e) => e.property === 'walletAddress' &&
          e.constraints?.['isStellarPublicKey']);
        if (walletError) {
          throw new BadRequestException({
            code: 'INVALID_WALLET_ADDRESS',
            message: 'walletAddress must be a valid Stellar public key.',
          });
        }
        throw new BadRequestException(errors);
      },
    }),
  );

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Agric-onchain Finance API')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, config));

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`Agric-onchain backend running on port ${port}`);
}

bootstrap();
