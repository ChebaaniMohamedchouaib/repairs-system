import { Test, TestingModule } from '@nestjs/testing';
import { RepairPartsController } from './repair-parts.controller';
import { RepairPartsService } from './repair-parts.service';

describe('RepairPartsController', () => {
  let controller: RepairPartsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RepairPartsController],
      providers: [RepairPartsService],
    }).compile();

    controller = module.get<RepairPartsController>(RepairPartsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
