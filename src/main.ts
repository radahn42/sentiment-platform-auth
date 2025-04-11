import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['kafka:9092'],
      },
      consumer: {
        groupId: 'auth-consumer',
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(3000, () =>
    console.log(`Auth service is running on port 3000`),
  );
}
bootstrap();
