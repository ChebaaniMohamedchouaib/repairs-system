import { Test, TestingModule } from '@nestjs/testing';
import { RepairPartsService } from './repair-parts.service';

describe('RepairPartsService', () => {
  let service: RepairPartsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RepairPartsService],
    }).compile();

    service = module.get<RepairPartsService>(RepairPartsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
