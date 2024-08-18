import { Publisher, PaymentCreatedEvent, Subject } from "@uatickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subject.PaymentCreated = Subject.PaymentCreated;
}