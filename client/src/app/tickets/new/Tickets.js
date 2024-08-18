'use client';
import { buildClient } from '@/api/build-client';
import useRequest from '@/hooks/use-request';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

function Tickets() {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const router = useRouter()
  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: {
      title,
      price
    },
    onSuccess: (data) => {
      router.push('/home')
      setTitle('')
      setPrice('')
    }
  })
  const handleSubmit = (e) => {
    e.preventDefault()
    doRequest()
  }
  const onBlur = () => {
    const value = parseFloat(price)
    if (isNaN(value)) {
      return;
    }
    setPrice(value.toFixed(2))
  }
  return (
    <div>
      <div>Create a ticket</div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input
            className='bg-gray-400 text-black'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
          />
        </div>
        <div>
          <label>Price</label>
          <input
            className='bg-gray-400 text-black'
            value={price}
            onBlur={onBlur}
            onChange={(e) => setPrice(e.target.value)}
            type="text"
          />
        </div>
        {errors}
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default Tickets