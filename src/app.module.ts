import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VideoCallModule } from './video-call/video-call.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // Verifique este caminho
    }),
    VideoCallModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
