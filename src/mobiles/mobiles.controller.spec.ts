import { Test, TestingModule } from '@nestjs/testing';
import { MobilesController } from './mobiles.controller';
import { MobilesService } from './mobiles.service';

describe('MobilesController', () => {
  let controller: MobilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MobilesController],
      providers: [MobilesService],
    }).compile();

    controller = module.get<MobilesController>(MobilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
