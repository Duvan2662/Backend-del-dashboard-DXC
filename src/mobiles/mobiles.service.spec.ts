import { Test, TestingModule } from '@nestjs/testing';
import { MobilesService } from './mobiles.service';

describe('MobilesService', () => {
  let service: MobilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MobilesService],
    }).compile();

    service = module.get<MobilesService>(MobilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
