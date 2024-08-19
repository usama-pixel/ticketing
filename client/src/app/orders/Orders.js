'use client';
import { buildClient } from '@/api/build-client'
import React, { useState } from 'react'

function Orders() {
  const [orders, setOrders] = useState([])
  const client = buildClient({headers: {}})
  client.get('https://ticketing.dev/api/orders')
  .then(res => {
    console.log({res})
    setOrders(res.data)
  })
  return (
    <div>
      <h1>Orders</h1>
      {orders.map(order => {
        return <li key={order?.id}>{order?.ticket?.title} - {order?.status}</li>
      })}
    </div>
  )
}

export default Orders