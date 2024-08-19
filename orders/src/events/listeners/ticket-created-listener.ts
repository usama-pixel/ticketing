import { Listener, Subject, TicketCreatedEvent } from "@uatickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    subject: Subject.TicketCreated = Subject.TicketCreated;
    queueGroupName: string = queueGroupName;
    async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        const { id, price, title } = data
        const ticket = Ticket.build({
            id,
            title,
            price
        })
        await ticket.save()
        msg.ack()
    }
}