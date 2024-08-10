import { Message, Stan } from "node-nats-streaming";
import { Subject } from "./subjects";

interface Event {
    subject: Subject;
    data: any;
}
export abstract class Listener<T extends Event> {
    abstract subject: T['subject'];
    abstract queueGroupName: string;
    abstract onMessage(data: T['data'], msg: Message): void;
    private client: Stan;
    protected ackWait = 5 * 1000;
    constructor(client: Stan) {
        this.client = client;
    }
    
    subscriptionOptions() {
        return this.client
        .subscriptionOptions()
        .setDeliverAllAvailable()
        .setManualAckMode(true)
        .setAckWait(this.ackWait)
        .setDurableName(this.queueGroupName)
        // we set setManualAckMode to true, because nats streaming server automatically acknowledges
        // that the message is recieved by a service. But if during the processing of the event the service fails, then theres no way of knowing
        // like for example an event called place_order is sent by nats, then the orders service recieves that event and starts its process of placing the order for client
        // and as soon as it is recieved nats says "okay, order service has recieved the event, everything is okay", but if the order service fails while it is placing the order
        // then we wont have any way of knwoing and automatically rerouting that event to another instance of that service in the same queue group. Which is why we only want to let nats know that event was
        // recieved and everything is okay and service is processing it, AFTER we have done our processing/bussiness logic, and we THEN MANUALLY acknowledge that the event was recieved.
    }

    listen() {
        // blow, order-service-queue-group is the queue group id, it ensures that if multiple instances of the same service are there,
        // then the the events are recieved by only one of them to avoid conditions where both the identical services make a change TWICE to a database or something.
        const subscription = this.client.subscribe(
            this.subject,
            this.queueGroupName,
            this.subscriptionOptions()
        )
        subscription.on('message', (msg: Message) => {
            console.log(
                `Message Recieved: ${this.subject} / ${this.queueGroupName}`
            )
            const parsedData = this.parseMessage(msg)
            this.onMessage(parsedData, msg)
        })
    }
    parseMessage(msg: Message) {
        const data = msg.getData()
        return typeof data === 'string'
        ? JSON.parse(data)
        : JSON.parse(data.toString('utf-8'))
    }
}