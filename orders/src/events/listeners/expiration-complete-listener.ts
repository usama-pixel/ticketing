import { ExpirationCompleteEvent, Listener, OrderStatus, Subject } from "@uatickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    subject: Subject.ExpirationComplete = Subject.ExpirationComplete;
    queueGroupName: string = queueGroupName;
    async onMessage(data: ExpirationCompleteEvent['data'], msg: Message): Promise<void> {
        const order = await Order.findById(data.orderId).populate('ticket')
        if (!order) {
            throw new Error('Order not found')
        }
        order.set({
            status: OrderStatus.Cancelled,
        })
        await order.save()
        await new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id
            }
        })
        msg.ack()
    }
}