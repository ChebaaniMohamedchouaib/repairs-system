import { Test, TestingModule } from '@nestjs/testing';
import { RepairsController } from './repairs.controller';
import { RepairsService } from './repairs.service';

describe('RepairsController', () => {
  let controller: RepairsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RepairsController],
      providers: [RepairsService],
    }).compile();

    controller = module.get<RepairsController>(RepairsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
