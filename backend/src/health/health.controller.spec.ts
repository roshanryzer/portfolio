import { Test } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { PrismaService } from '../prisma/prisma.service';

describe('HealthController', () => {
  let controller: HealthController;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: PrismaService,
          useValue: { $queryRaw: jest.fn().mockResolvedValue([1]) },
        },
      ],
    }).compile();
    controller = module.get(HealthController);
    prisma = module.get(PrismaService);
  });

  it('returns ok when DB is connected', async () => {
    await expect(controller.check()).resolves.toEqual({ status: 'ok', database: 'connected' });
  });

  it('returns error when DB fails', async () => {
    jest.spyOn(prisma, '$queryRaw').mockRejectedValueOnce(new Error('connection refused'));
    await expect(controller.check()).resolves.toEqual({ status: 'error', database: 'disconnected' });
  });
});
