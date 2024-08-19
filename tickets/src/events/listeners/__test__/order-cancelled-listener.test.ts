import { OrderCancelledEvent } from "@uatickets/common"
import { Ticket } from "../../../models/ticket"
import { natsWrapper } from "../../../nats-wrapper"
import { TestListener2 as OrderCancelledListener } from "../test-listener2"
import mongoose from "mongoose"

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client)
    const orderId = new mongoose.Types.ObjectId().toHexString()
    const ticket = Ticket.build({
        title: 'concert',
        price: 10,
        userId: '123'
    })
    ticket.set({ orderId })
    await ticket.save()
    const data: OrderCancelledEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        ticket: {
            id: ticket.id
        }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, ticket, data, msg }
}

it('updates the ticket, publishes an event, and acks the message', async () => {
    const { listener, ticket, data, msg } = await setup()

    await listener.onMessage(data, msg)
    const updatedTicket = await Ticket.findById(ticket.id)
    expect(updatedTicket!.orderId).not.toBeDefined()

    expect(msg.ack).toHaveBeenCalled()
    expect(natsWrapper.client.publish).toHaveBeenCalled()
})