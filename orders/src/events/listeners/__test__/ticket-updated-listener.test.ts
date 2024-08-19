import { OrderStatus, TicketUpdatedEvent } from "@uatickets/common"
import { natsWrapper } from "../../../nats-wrapper"
import { TicketUpdatedListener } from "../ticket-updated-listener"
import mongoose from "mongoose"
import { Ticket } from "../../../models/ticket"

const setup = async () => {
    const listener = new TicketUpdatedListener(natsWrapper.client)
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    })
    await ticket.save()
    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        version: ticket.version + 1,
        title: 'new concert',
        price: 999,
        userId: '123'
    }
    const checkBro = await Ticket.findById(data.id)
    console.log({checkBro})
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }
    return { listener, data, msg, ticket }
}

it('finds, updates, and saves a ticket', async () => {
    const { listener, data, msg, ticket } = await setup()
    await listener.onMessage(data, msg)

    const updatedTicket = await Ticket.findById(ticket.id)
    console.log({updatedTicket})
    expect(updatedTicket!.title).toEqual(data.title)
    expect(updatedTicket!.price).toEqual((data.price))
})

it('acks the message', async () => {
    const { listener, data, msg } = await setup()
    await listener.onMessage(data, msg)
    expect(msg.ack).toHaveBeenCalled()
})

it('does not call ack if the event has a skipped version number', async () => {
    const { listener, data, msg } = await setup()
    data.version = 10
    try {
        await listener.onMessage(data, msg)
    } catch(err) {}
    expect(msg.ack).not.toHaveBeenCalled()
})