'use client';
import { buildClient } from "@/api/build-client";
import useRequest from "@/hooks/use-request";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [user, setUser] = useState(null)
  const [tickets, setTickets] = useState([])
  const { doRequest, errors } = useRequest({
    url: '/api/tickets/',
    onSuccess: (data) => {
      console.log({tickets: data})
      setTickets(data)
    },
    method: 'get',
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
  // console.log('cookie', headers().get('cookie'))
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <h2>Tickets</h2>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Price</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => {
              return (
                <tr key={ticket.id}>
                  <td>{ticket.title}</td>
                  <td>{ticket.price}</td>
                  <td>
                    <Link
                      href={`/tickets/${ticket.id}`}
                      className="text-blue-500"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {/* <h1 className="text-lg">{user ? 'You are signed in': 'You NOT Signed In'}</h1> */}
    </main>
  );
}