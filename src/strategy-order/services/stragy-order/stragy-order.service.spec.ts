import { Test, TestingModule } from '@nestjs/testing';
import { StragyOrderService } from './stragy-order.service';

describe('StragyOrderService', () => {
  let service: StragyOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StragyOrderService],
    }).compile();

    service = module.get<StragyOrderService>(StragyOrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
