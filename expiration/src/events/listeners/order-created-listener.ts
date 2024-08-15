import { Listener, OrderCreatedEvent, OrderStatus, Subject } from "@uatickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subject.OrderCreated = Subject.OrderCreated;
    queueGroupName: string = queueGroupName;
    async onMessage(data: OrderCreatedEvent['data'], msg: Message): Promise<void> {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime()
        console.log(`Waiting ${delay} miliseconds to process the job`)
        await expirationQueue.add({
            orderId: data.id
        }, {
            delay
        })
        msg.ack()
    }
}