import { Listener, Subject, TicketUpdatedEvent } from "@uatickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    subject: Subject.TicketUpdated = Subject.TicketUpdated;
    queueGroupName: string = queueGroupName;
    async onMessage(data: TicketUpdatedEvent['data'], msg: Message): Promise<void> {
        const { id, price, title } = data
        console.log({data})
        const ticket = await Ticket.findByEvent(data)
        console.log({ticketBro: ticket})
        if (!ticket) {
            throw new Error('Ticket not found')
        }
        ticket.set({ price, title})
        await ticket.save()
        msg.ack()
    }
}