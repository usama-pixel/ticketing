import { Listener, OrderCreatedEvent, Subject } from "@uatickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class TestListener extends Listener<OrderCreatedEvent> {
    subject: Subject.OrderCreated = Subject.OrderCreated
    queueGroupName: string = queueGroupName // so far, the issue seems to be with queuegroup name
    // if i use the variable queuegroupname from the file, it is giving the issue, but any other direct name in string quotations is fine
    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        console.log('Brrrahh2', data)
        const ticket = await Ticket.findById(data.ticket.id)
        if (!ticket) {
            throw new Error('Ticket not found')
        }
        ticket.set({orderId: data.id})
        await ticket.save()
        console.log('orderId set on ticket')
        console.log({ticket})
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            orderId: ticket.orderId,
            version: ticket.version
        })
        msg.ack()
    }
}