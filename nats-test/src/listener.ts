import { randomBytes } from 'crypto'
import nats from 'node-nats-streaming'
import { TicketCreatedListener } from './events/ticket-created-listener'

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
    new TicketCreatedListener(stan).listen()
})

// this line says that whenever ctrl + c is pressed on the terminal, close the nats connection, which in turn will end the process as you can see above in stan.on('close')
process.on('SIGINT', () => stan.close())
// same thing as above but with ctrl + d
process.on('SIGTERM', () => stan.close())
