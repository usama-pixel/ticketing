'use client';
import useRequest from '@/hooks/use-request';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

function Signin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const {doRequest, errors } = useRequest({
    url: '/api/users/signin',
    method: 'post',
    body: {email, password},
    onSuccess: () => router.push('/home')
  })
  const submit = async (e) => {
    e.preventDefault()
    doRequest()
  }
  return (
    <form onSubmit={submit}>
      <h1>Signin</h1>
      <div>
        <label>Email Address</label>
        <input
          className='bg-gray-400 text-black'
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label>Password</label>
        <input
          className='bg-gray-400 text-black'
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      {errors}
      <button className='rounded-lg px-2 py-1 bg-green-500 text-white'>Signin</button>
    </form>
  )
}

export default Signin