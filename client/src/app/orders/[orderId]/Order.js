'use client';
import { buildClient } from '@/api/build-client';
import useRequest from '@/hooks/use-request'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import StripeCheckout from 'react-stripe-checkout';

function Order() {
    const [order, setOrder] = useState({})
    const { orderId } = useParams()
    const [token, setToken] = useState(null)
    const [user, setUser] = useState(null)
    const [timeLeft, setTimeLeft] = useState(0)

    const { doRequest, errors } = useRequest({
        url: `/api/orders/${orderId}`,
        method: 'get',
        onSuccess: (data) => {
            setOrder(data)
        }
    })
    const { doRequest: doPayment, errors: paymentErrors } = useRequest({
        url: '/api/payments',
        method: 'post',
        body: {
            orderId,
        },
        onSuccess: (payment) => {
            console.log({payment})
        }
    })
    const client = buildClient({
        server: false
    })
    const getUser = async () => {
        const client = buildClient({
          server: false
        })
        const { data } = await client.get('/api/users/currentuser')
        setUser(data?.currentUser || null)
    }
    useEffect(() => {
        getUser()
        doRequest()
    }, [])
    useEffect(() => {
        console.log(order)
        const intervalId = setInterval(() => {
            setTimeLeft(Math.round((new Date(order.expiresAt) - new Date())/1000))
        }, 1000)
        return () => {
            clearInterval(intervalId)
        }
    }, [order])
    if(timeLeft < 0) {
        return <div>Order Expired</div>
    }
    console.log('ticket price', order?.ticket?.price)
  return (
    <div>
        {timeLeft} seconds left to pay
        {
            user &&
            order &&
            order.ticket &&
            order.ticket.price &&
            <>
                <StripeCheckout
                    token={async ({id}) => {
                        await client.post('https://ticketing.dev/api/payments', {
                            token: id,
                            orderId
                        })
                        // doPayment({token: id})
                    }}
                    stripeKey='pk_test_51M2s0AA3kPKlSwobs2FDqyHTcOBdN3ri8LaGEsEWSbN2x1gXy10X1NG1ppUsU7DgSA2aNTdIxerfZrHqiag2gpqE0012D4ULPR'
                    amount={order.ticket.price * 100}
                    email={user.email}
                />
                {paymentErrors}
            </>
        }
    </div>
  )
}

export default Order