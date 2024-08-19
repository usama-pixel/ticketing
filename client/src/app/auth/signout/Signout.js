'use client'
import useRequest from '@/hooks/use-request'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

function Signout() {
    const router = useRouter()
    const { doRequest, errors } = useRequest({
      // /api/users/signin
        url: '/api/users/signout',
        method: 'post',
        body: {},
        onSuccess: () => {
          router.push('/home')
        }
    })
    useEffect(() => {
      doRequest()
    }, [])
  return (
    <div>Signing you out...</div>
  )
}

export default Signout