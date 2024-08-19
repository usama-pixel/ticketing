import { Publisher, Subject, TicketCreatedEvent } from '@uatickets/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subject.TicketCreated = Subject.TicketCreated;
}