import { Test, TestingModule } from '@nestjs/testing';
import { TicketsService } from './tickets.service.js';
import { UpdateTicketDto } from './dto/update-ticket.dto.js';

describe('TicketsService', () => {
  let service: TicketsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TicketsService],
    }).compile();

    service = module.get<TicketsService>(TicketsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('preserves omitted fields when updating priority', () => {
    const original = { ...service.findOne(1) };
    const payload = Object.assign(new UpdateTicketDto(), {
      subject: undefined,
      description: undefined,
      priority: 'low' as const,
    });

    expect(service.update(1, payload)).toEqual({
      ...original,
      priority: 'low',
    });
    expect(service.findOne(1)).toEqual({ ...original, priority: 'low' });
  });

  it('updates subject and description while preserving priority', () => {
    const original = { ...service.findOne(1) };

    expect(
      service.update(1, {
        subject: 'Updated subject',
        description: 'Updated description',
      }),
    ).toEqual({
      ...original,
      subject: 'Updated subject',
      description: 'Updated description',
    });
  });
});
