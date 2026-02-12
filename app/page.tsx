// app/page.tsx  (complete file)
'use client'
import { useState, useEffect } from 'react'
import { LiveKitRoom, AudioConference } from '@livekit/components-react'
import '@livekit/components-styles'
import { RoomAudioRenderer } from '@livekit/components-react';

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [loggedIn, setLoggedIn] = useState(false)
  const [showLogin, setShowLogin] = useState(true)
  const [showRegister, setShowRegister] = useState(false)
  const [inCall, setInCall] = useState(false)
  const [token, setToken] = useState('')
  const [roomName, setRoomName] = useState('')
  const [incoming, setIncoming] = useState<any>(null)
  const [loginPhone, setLoginPhone] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      const u = JSON.parse(stored)
      setUser(u)
      setLoggedIn(true)
    }
  }, [])

  useEffect(() => {
  if (!user?.id || inCall) return
  const interval = setInterval(async () => {
    const res = await fetch(`/api/incoming?userId=${user.id}`)
    const data = await res.json()
    if (data && data.caller_id !== user.id) {
  setIncoming(data)
}
  }, 5000)
  return () => clearInterval(interval)
}, [user, inCall])

  const handleLogin = async (phone: string) => {
    const res = await fetch(`/api/users?phone=${encodeURIComponent(phone)}`)
    if (res.ok) {
      const [found] = await res.json()
      if (found) {
        localStorage.setItem('user', JSON.stringify(found))
        setUser(found)
        setLoggedIn(true)
        setShowLogin(false)
      } else {
        alert('No user found')
      }
    }
  }

  const handleRegister = async (name: string, phone: string) => {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone_number: phone })
    })
    if (res.ok) {
      const newUser = await res.json()
      localStorage.setItem('user', JSON.stringify(newUser))
      setUser(newUser)
      setLoggedIn(true)
      setShowRegister(false)
    } else {
      alert('Registration failed')
    }
  }

  const startCall = async () => {
    if (!user?.id) return
    const res = await fetch(`/api/token?userId=${user.id}`)
    if (!res.ok) return alert('No available users')
    const data = await res.json()
    setToken(data.token)
    setRoomName(data.roomName)
    setInCall(true)
  }

  const acceptCall = async () => {
    if (!incoming || !user?.id) return
    const res = await fetch('/api/accept-call', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ callId: incoming.id, userId: user.id })
    })
    const { roomName } = await res.json()
    const tokenRes = await fetch(`/api/join-token?userId=${user.id}&roomName=${encodeURIComponent(roomName)}`)
    const { token } = await tokenRes.json()
    setToken(token)
    setRoomName(roomName)
    setInCall(true)
    setIncoming(null)
  }

  if (inCall && token) {
    return (
    <LiveKitRoom
  token={token}
  serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
  connect={true}
  audio={true}
  video={false}
  onConnected={() => console.log('Connected to room')}
  onDisconnected={() => console.log('Disconnected')}
  onError={(err) => console.error('LiveKit error:', err)}
>
  <AudioConference />
  <RoomAudioRenderer volume={1.0} />
</LiveKitRoom>
    )
  }

  if (loggedIn) {
    return (
      <div className="min-h-screen bg-linear-to-b from-blue-950 to-black text-white flex flex-col items-center justify-center p-6">
        <h1 className="text-6xl font-bold mb-4">CALL CENTER</h1>
        <p className="text-2xl mb-12">DISTRIBUTED ARTWORK</p>

        <div className="mb-12 flex items-center gap-3">
          <div className={`w-5 h-5 rounded-full ${user.is_available ? 'bg-green-400' : 'bg-red-500'}`} />
          <span className="text-2xl">{user.is_available ? 'available' : 'unavailable'}</span>
        </div>

        <button onClick={startCall} className="w-64 py-6 bg-white/20 rounded-xl text-2xl mb-12 hover:bg-white/30">
          Call
        </button>

        <button
          onClick={async () => {
            const newVal = !user.is_available
            await fetch('/api/users', {
              method: 'POST',
              body: JSON.stringify({ id: user.id, is_available: newVal }),
              headers: { 'Content-Type': 'application/json' }
            })
            setUser({ ...user, is_available: newVal })
          }}
          className="w-64 py-5 bg-white/10 rounded-full hover:bg-white/20"
        >
          {user.is_available ? 'Become unavailable' : 'Become available'}
        </button>

        {incoming && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-8 rounded-xl text-center">
              <h2 className="text-3xl mb-6">Incoming from {incoming.caller_name}</h2>
              <button onClick={acceptCall} className="bg-green-600 px-8 py-4 rounded-lg mr-4 text-xl">
                Answer
              </button>
              <button onClick={() => setIncoming(null)} className="bg-red-600 px-8 py-4 rounded-lg text-xl">
                Reject
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-950 to-black text-white flex items-center justify-center">
      <div className="text-center space-y-12 max-w-md px-6">
        <h1 className="text-5xl font-bold">CALL CENTER</h1>
        <p className="text-xl">DISTRIBUTED ARTWORK</p>

        <div className="space-y-6">
          <button
            onClick={() => setShowLogin(true)}
            className="w-full py-5 bg-white/10 rounded-full text-lg hover:bg-white/20"
          >
            LOG IN
          </button>
          <button
            onClick={() => setShowRegister(true)}
            className="w-full py-5 bg-white/5 rounded-full text-lg hover:bg-white/15"
          >
            REGISTER
          </button>
        </div>

        <p className="text-sm opacity-60">Higher Forces • distributed artwork</p>
      </div>

      {showLogin && (
  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
    <div className="bg-linear-to-b from-blue-950/90 to-black/90 rounded-2xl p-8 w-full max-w-md relative">
      <button onClick={() => setShowLogin(false)} className="absolute top-4 right-6 text-3xl">×</button>
      <div className="space-y-8">
        <h2 className="text-4xl font-bold">Welcome back</h2>
        <input
          type="tel"
          value={loginPhone}
          onChange={e => setLoginPhone(e.target.value)}
          placeholder="your phone number"
          className="w-full p-5 bg-white/10 rounded-xl text-white placeholder-white/50 border-none focus:outline-none focus:ring-2 focus:ring-white/30"
        />
        <button
          onClick={() => loginPhone && handleLogin(loginPhone)}
          className="w-full py-5 bg-white/20 rounded-full text-lg hover:bg-white/30"
        >
          LOG IN
        </button>
      </div>
    </div>
  </div>
)}

      {showRegister && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-linear-to-b from-blue-950/90 to-black/90 rounded-2xl p-8 w-full max-w-md relative">
            <button onClick={() => setShowRegister(false)} className="absolute top-4 right-6 text-3xl">×</button>
            <div className="space-y-8">
              <h2 className="text-4xl font-bold">Register</h2>
              <input
                placeholder="Name"
                className="w-full p-5 bg-white/10 rounded-xl text-white placeholder-white/50 border-none focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <input
                type="tel"
                placeholder="Phone number"
                className="w-full p-5 bg-white/10 rounded-xl text-white placeholder-white/50 border-none focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <button
                onClick={() => {/* read inputs and call handleRegister */}}
                className="w-full py-5 bg-white/20 rounded-full text-lg hover:bg-white/30"
              >
                REGISTER
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}