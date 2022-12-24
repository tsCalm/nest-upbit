import { Test, TestingModule } from '@nestjs/testing';
import { StragyOrderController } from './strategy-order.controller';

describe('StragyOrderController', () => {
  let controller: StragyOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StragyOrderController],
    }).compile();

    controller = module.get<StragyOrderController>(StragyOrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
