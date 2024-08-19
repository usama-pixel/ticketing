import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { natsWrapper } from '../nats-wrapper'
import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@uatickets/common'
import { Order } from '../models/order'
import { stripe } from '../stripe'
import { Payment } from '../models/payment'
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher'

const router = express.Router()

router.post(
    '/api/payments',
    requireAuth,
    [
        body('token')
        .not()
        .isEmpty(),
        body('orderId')
        .not()
        .isEmpty()
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { orderId, token } = req.body
        const order = await Order.findById(orderId)
        
        if (!order) {
            throw new NotFoundError()
        }
        if (order.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError()
        }
        if (order.status === OrderStatus.Cancelled) {
            throw new BadRequestError('Cannot pay for an expired order')
        }
        const charge = await stripe.charges.create({
            amount: order.price * 100,
            currency: 'usd',
            source: token,
            description: 'Order price'
        })
        const payment = Payment.build({
            orderId,
            stripeId: charge.id
        })
        new PaymentCreatedPublisher(natsWrapper.client).publish({
            id: payment.id,
            orderId: payment.orderId,
            stripeId: payment.stripeId
        })
        // new.test.ts is giving error here
        await payment.save()
        res.status(201).send({ id: payment.id })
    }
)


export { router as createChargeRouter }