import { randomBytes } from 'crypto'
import nats, { Message, Stan } from 'node-nats-streaming'

console.clear()
const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    // the 2nd argument here is the client id, and it is unique to each instance of the service in the nats streaming service
    // so we are generating a random string here because if we were to create multiple instances of the service
    // then each instance would have a different client id.
    url: 'http://localhost:4222'
})

stan.on('connect', () => {
    console.log('Listener connected to nats')
    stan.on('close', () => {
        console.log('Nats connection closed')
        process.exit()
    })
    const options = stan
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable()
    .setDurableName('accounting-service')
    // we set setManualAckMode to true, because nats streaming server automatically acknowledges
    // that the message is recieved by a service. But if during the processing of the event the service fails, then theres no way of knowing
    // like for example an event called place_order is sent by nats, then the orders service recieves that event and starts its process of placing the order for client
    // and as soon as it is recieved nats says "okay, order service has recieved the event, everything is okay", but if the order service fails while it is placing the order
    // then we wont have any way of knwoing and automatically rerouting that event to another instance of that service in the same queue group. Which is why we only want to let nats know that event was
    // recieved and everything is okay and service is processing it, AFTER we have done our processing/bussiness logic, and we THEN MANUALLY acknowledge that the event was recieved.

    // blow, order-service-queue-group is the queue group id, it ensures that if multiple instances of the same service are there,
    // then the the events are recieved by only one of them to avoid conditions where both the identical services make a change TWICE to a database or something.
    const subscription = stan.subscribe(
        'ticket:created',
        'queue-group-name',
        options
    )
    subscription.on('message', (msg: Message) => {
        const data = msg.getData()
        if(typeof data === 'string') {
            console.log(`Recieved event #${msg.getSequence()}, with data ${data}`)
        }
        msg.ack()
    })
})

// this line says that whenever ctrl + c is pressed on the terminal, close the nats connection, which in turn will end the process as you can see above in stan.on('close')
process.on('SIGINT', () => stan.close())
// same thing as above but with ctrl + d
process.on('SIGTERM', () => stan.close())

