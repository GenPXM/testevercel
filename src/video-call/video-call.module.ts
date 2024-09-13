import { Module } from '@nestjs/common';
import { VideoCallGateway } from '../video-call/video-call/video-call.gateway';

@Module({
  providers: [VideoCallGateway],
})
export class VideoCallModule {}
