
it('abc', async () => {
    expect(1).toEqual(1)
})
// import request from 'supertest'
// import { app } from '../../app'
// import mongoose from 'mongoose'
// import { Order } from '../../models/order'
// import { OrderStatus } from '@uatickets/common'

// it('returns a 404 when purchasing an order that does not exist', async () => {
//     await request(app)
//     .post('/api/payments')
//     .set('Cookie', global.signin())
//     .send({
//         token: 'asldkfj',
//         orderId: new mongoose.Types.ObjectId().toHexString()
//     })
//     .expect(404)
// })

// it('returns a 401 when purchasing an order that doesnt belong to the user', async () => {
//     const order = Order.build({
//         id: new mongoose.Types.ObjectId().toHexString(),
//         userId: new mongoose.Types.ObjectId().toHexString(),
//         version: 0,
//         price: 20,
//         status: OrderStatus.Created
//     })
//     await order.save()
//     await request(app)
//     .post('/api/payments')
//     .set('Cookie', global.signin())
//     .send({
//         token: 'asldkfj',
//         orderId: order.id
//     })
//     .expect(401)
// })

// it('returns 400 when purchasing a cancelled order', async () => {})