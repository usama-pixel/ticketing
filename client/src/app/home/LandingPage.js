'use client';
import { buildClient } from "@/api/build-client";
import axios from "axios";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [user, setUser] = useState(null)
  useEffect(() => {
    (async () => {
      const client = buildClient({
        server: false
      })
      const { data } = await client.get('/api/users/currentuser')
      setUser(data?.currentUser || null)
      // console.log('cookieBruv:', headers().get('cookie'))
    })()
  }, [])
  // console.log('cookie', headers().get('cookie'))
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-lg">{user ? 'You are signed in': 'You NOT Signed In'}</h1>
    </main>
  );
}