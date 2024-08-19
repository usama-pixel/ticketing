'use client';
import { buildClient } from '@/api/build-client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

function ClientNavbar() {
    const [links, setLinks] = useState([])
    const [email, setEmail] = useState(null)
    
    useEffect(() => {
        const run = async () => {
            const client = buildClient({
                server: false
            })
            const { data } = await client.get('/api/users/currentuser')
            setEmail(data?.currentUser?.email || null)
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
            setLinks(links)
        }
        run()
    }, [])
  return (
    // <div>Header: {data?.currentUser?.email}</div>
    <nav className=''>
        <Link href={'/'}>GitTix: {email}</Link>
        <div className='flex justify-end'>
            <ul className='flex items-center'>
                {/* {data?.currentUser ? 'Sign out': 'Sign in/up'} */}
                {links}
            </ul>
        </div>
    </nav>
  )
}

export default ClientNavbar