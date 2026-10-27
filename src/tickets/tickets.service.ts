import { Injectable, NotFoundException } from '@nestjs/common';
import { Ticket } from './ticket.interface.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';
import { UpdateTicketDto } from './dto/update-ticket.dto.js';

@Injectable()
export class TicketsService {
  private readonly tickets: Ticket[] = [
    {
      id: 1,
      subject: 'Cannot login',
      description: 'User cannot login to the system',
      priority: 'high',
      status: 'open',
      createdAt: '2023-01-01T00:00:00Z',
    },
    {
      id: 2,
      subject: 'Payment failed',
      description: 'Payment transaction failed',
      priority: 'medium',
      status: 'open',
      createdAt: '2023-01-02T00:00:00Z',
    },
    {
      id: 3,
      subject: 'Feature request',
      description: 'Request for a new feature',
      priority: 'low',
      status: 'closed',
      createdAt: '2023-01-03T00:00:00Z',
    },
    {
      id: 4,
      subject: 'Bug in the system',
      description: 'There is a bug in the system that needs to be fixed',
      priority: 'high',
      status: 'closed',
      createdAt: '2023-01-04T00:00:00Z',
    },
  ];

  private nextTicketId = 5;

  findAll(status?: Ticket['status'], priority?: Ticket['priority']) {
    return this.tickets.filter((ticket) => {
      if (status && ticket.status !== status) {
        return false;
      }
      if (priority && ticket.priority !== priority) {
        return false;
      }
      return true;
    });
  }
  findOne(id: number) {
    const ticket = this.tickets.find((ticket) => ticket.id === id);
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }
    return ticket;
  }
  create(payload: CreateTicketDto) {
    const ticket: Ticket = {
      id: this.nextTicketId++,
      subject: payload.subject,
      description: payload.description,
      priority: payload.priority,
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    this.tickets.push(ticket);
    return ticket;
  }
  update(id: number, payload: UpdateTicketDto) {
    const ticket = this.findOne(id);

    if (ticket.status === 'closed') {
      throw new NotFoundException(
        `Ticket with ID ${id} is closed and cannot be updated`,
      );
    }
    Object.assign(ticket, payload);
    return ticket;
  }
  closeTicket(id: number) {
    const ticket = this.findOne(id);
    if (ticket.status === 'closed') {
      throw new NotFoundException(`Ticket with ID ${id} is already closed`);
    }
    ticket.status = 'closed';
    return ticket;
  }
}
