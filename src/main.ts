import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

const { RABBIT_HOST, RABBIT_QUEUE } = process.env;

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [RABBIT_HOST],
      queue: RABBIT_QUEUE
      
    }
  });
  await app.init()
  await app.listen();
}
bootstrap();
