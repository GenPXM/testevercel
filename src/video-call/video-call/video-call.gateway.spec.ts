import { Test, TestingModule } from '@nestjs/testing';
import { VideoCallGateway } from './video-call.gateway';

describe('VideoCallGateway', () => {
  let gateway: VideoCallGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VideoCallGateway],
    }).compile();

    gateway = module.get<VideoCallGateway>(VideoCallGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
