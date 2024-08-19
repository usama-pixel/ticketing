import { buildClient } from '@/api/build-client'
import { headers } from 'next/headers'
import Link from 'next/link'
import React from 'react'

async function Navbar() {
    const client = buildClient({
        headers: headers(),
        server: true
    })
    const { data } = await client.get('/api/users/currentuser')
    console.log({yah: data})
    const links = [
        !data?.currentUser && {label: 'Sign Up', href: '/auth/signup'}, // this sort of expression will give either true or false, 
        !data?.currentUser && {label: 'Sign In', href: '/auth/signin'}, // same here
        data?.currentUser && {label: 'Sell Tickets', href: '/tickets/new'},
        data?.currentUser && {label: 'My Orders', href: '/orders'},
        data?.currentUser && {label: 'Sign Out', href: '/auth/signout'}, // same here
    ]
    .filter(linkConfig => linkConfig)
    .map(({label, href}) => {
        return <li className='p-2' key={href}>
            <Link href={href}>
                {label}
            </Link>
        </li>
    })
  return (
    // <div>Header: {data?.currentUser?.email}</div>
    <nav className=''>
        <Link href={'/'}>GitTix</Link>
        <div className='flex justify-end'>
            <ul className='flex items-center'>
                {/* {data?.currentUser ? 'Sign out': 'Sign in/up'} */}
                {links}
            </ul>
        </div>
    </nav>
  )
}

export default Navbar