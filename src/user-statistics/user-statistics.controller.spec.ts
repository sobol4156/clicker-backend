import { Test, TestingModule } from '@nestjs/testing';
import { UserStatisticsController } from './user-statistics.controller';

describe('UserStatisticsController', () => {
  let controller: UserStatisticsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserStatisticsController],
    }).compile();

    controller = module.get<UserStatisticsController>(UserStatisticsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
