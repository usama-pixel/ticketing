import { Listener, NotFoundError, OrderStatus, PaymentCreatedEvent, Subject } from "@uatickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    subject: Subject.PaymentCreated = Subject.PaymentCreated;
    queueGroupName: string = queueGroupName;
    async onMessage(data: PaymentCreatedEvent['data'], msg: Message): Promise<void> {
        const order = await Order.findById(data.orderId);
        if (!order) {
            throw new Error('Order not found')
        }
        order.set({
            status: OrderStatus.Complete
        })
        await order.save();
        msg.ack()
    }
}