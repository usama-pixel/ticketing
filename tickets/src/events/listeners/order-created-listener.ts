// import { Listener, OrderCreatedEvent, OrderStatus, Subject } from "@uatickets/common";
// import { queueGroupName } from "./queue-group-name";
// import { Message } from "node-nats-streaming";
// import { Ticket } from "../../models/ticket";
// import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
// import { natsWrapper } from "../../nats-wrapper";

// export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
//     subject: Subject.OrderCreated = Subject.OrderCreated;
//     queueGroupName: string = queueGroupName;
//     async onMessage(data: OrderCreatedEvent['data'], msg: Message): Promise<void> {
//         console.log('ticket order created')
//         const ticket = await Ticket.findById(data.ticket.id)
//         if (!ticket) {
//             throw new Error('Ticket not found')
//         }
//         ticket.set({orderId: data.id})
//         await ticket.save()
//         console.log('orderId set on ticket')
//         await new TicketUpdatedPublisher(this.client).publish({
//             id: ticket.id,
//             price: ticket.price,
//             title: ticket.title,
//             userId: ticket.userId,
//             orderId: ticket.orderId,
//             version: ticket.version
//         })
//         msg.ack()
//     }
// }