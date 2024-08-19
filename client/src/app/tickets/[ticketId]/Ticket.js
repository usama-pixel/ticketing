'use client';
import useRequest from '@/hooks/use-request';
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

function Ticket() {
    const { ticketId } = useParams()
    const [ticket, setTicket] = useState({})
    const router = useRouter()
    const { doRequest, errors } = useRequest({
        url: `/api/tickets/${ticketId}`,
        method: 'get',
        onSuccess: (data) => {
            setTicket(data)
        }
    })
    useEffect(() => {
        doRequest()
    }, [])
    const { doRequest: doPurchase, errors: purchaseErrors } = useRequest({
        url: `/api/orders`,
        method: 'post',
        body: {
            ticketId: ticket.id
        },
        onSuccess: (order) => {
            router.push(`/orders/${order.id}`)
        }
    })
  return (
    <div>
        <h1>Ticket</h1>
        <h1>{ticket.title}</h1>
        <h1>Price: {ticket.price}</h1>
        {purchaseErrors}
        <button
            className='bg-blue-500 text-white p-2 rounded'
            onClick={() => doPurchase()}
        >Purchase</button>
    </div>
  )
}

export default Ticket