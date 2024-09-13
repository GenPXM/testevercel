// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   app.enableCors(); // Habilita CORS para permitir acesso externo
//   await app.listen(8080, '192.168.1.127'); // Escuta na interface de rede especificada (IP) e porta 139
// }
// bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('ssl/chave-privada.pem'), // Caminho para a chave privada gerada
    cert: fs.readFileSync('ssl/certificado.pem'), // Caminho para o certificado gerado
  };

  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });

  app.enableCors();
  await app.listen(8080, '192.168.1.127'); // Escuta na porta 8080
}
bootstrap();
