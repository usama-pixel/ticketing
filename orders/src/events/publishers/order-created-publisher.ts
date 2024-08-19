import { Publisher, OrderCreatedEvent, Subject, OrderStatus } from "@uatickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subject.OrderCreated = Subject.OrderCreated;
}