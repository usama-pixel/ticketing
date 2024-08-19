import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener";
import { Subject } from "./subjects";
import { TicketCreatedEvent } from "./ticket-created-event";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject: Subject.TicketCreated = Subject.TicketCreated;
    queueGroupName = 'payments-service';
    onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
        console.log('event data!', data)
        msg.ack()
    }
}