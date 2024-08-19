import { Listener, OrderCancelledEvent, Subject } from "@uatickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class TestListener2 extends Listener<OrderCancelledEvent> {
    subject: Subject.OrderCancelled = Subject.OrderCancelled;
    queueGroupName: string = 'queueGroupName'
    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        console.log('Ticket order cancelled')
        const ticket = await Ticket.findById(data.ticket.id)
        if (!ticket) {
            throw new Error('Ticket not found')
        }
        ticket.set({orderId: undefined})
        await ticket.save()
        new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            orderId: ticket.orderId,
            userId: ticket.userId,
            price: ticket.price,
            title: ticket.title,
            version: ticket.version
        })
        msg.ack()
    }
}