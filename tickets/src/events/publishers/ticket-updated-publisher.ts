import { Publisher, Subject, TicketUpdatedEvent } from '@uatickets/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subject.TicketUpdated = Subject.TicketUpdated;
}