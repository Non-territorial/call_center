'use client'
import { useState, useEffect } from 'react'
import CallModes from '@/components/CallModes' // adjust path if needed
import '@livekit/components-styles'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [loggedIn, setLoggedIn] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
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
  if (!res.ok) {
    alert('No available users online')
    return
  }
  const data = await res.json()
  if (!data.token || !data.roomName) {
    alert('No available users online')
    return
  }
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
    return <CallModes 
      token={token} 
      roomName={roomName} 
      onEndCall={() => setInCall(false)} 
    />
  }

  /* ─── Bloom orb layer (reused in both logged-in and logged-out views) ─── */
  const Orbs = () => (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-32 -left-20 w-105 h-105 rounded-full bg-[radial-gradient(circle,rgba(26,79,190,0.70)_0%,transparent_70%)] mix-blend-screen animate-[breathe1_9s_ease-in-out_infinite]" />
      <div className="absolute top-20 left-16 w-90 h-90 rounded-full bg-[radial-gradient(circle,rgba(80,40,160,0.55)_0%,transparent_68%)] mix-blend-screen animate-[breathe2_11s_ease-in-out_infinite]" />
      <div className="absolute top-40 -right-24 w-95 h-95 rounded-full bg-[radial-gradient(circle,rgba(20,110,140,0.60)_0%,transparent_68%)] mix-blend-screen animate-[breathe3_10s_ease-in-out_infinite]" />
      <div className="absolute bottom-16 -left-14 w-75 h-75 rounded-full bg-[radial-gradient(circle,rgba(30,80,200,0.50)_0%,transparent_65%)] mix-blend-screen animate-[breathe1_12s_ease-in-out_infinite_reverse]" />
      <div className="absolute -bottom-10 right-0 w-70 h-70 rounded-full bg-[radial-gradient(circle,rgba(60,20,130,0.45)_0%,transparent_65%)] mix-blend-screen animate-[breathe2_8s_ease-in-out_infinite_reverse]" />
    </div>
  )

  if (loggedIn) {
    return (
      <div className="relative min-h-screen bg-[#0e1f3d] text-white flex flex-col items-center justify-center p-6 overflow-hidden">
        <Orbs />

        <div className="relative z-10 flex flex-col items-center gap-10 w-full max-w-xs">

          {/* Title */}
          <div className="text-center">
            <h1 className="text-5xl font-light tracking-[0.2rem] uppercase">CALL CENTER</h1>
            <p className="text-xs tracking-[0.25em] uppercase text-white/50 mt-2">distributed artwork</p>
          </div>

          {/* Availability status pill */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
            <div className={`w-2 h-2 rounded-full shrink-0 ${user.is_available ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-red-600 shadow-[0_0_8px_rgba(52,211,153,0.8)]'}`} />
            <span className="text-[10px] tracking-widest text-white/50 uppercase">{user.is_available ? 'available' : 'unavailable'}</span>
          </div>

          {/* Call — main verb, Bloom-style */}
          <div className="w-full border-t border-b border-white/13 py-1">
            <div className="flex justify-center">
              <button onClick={startCall} className="text-3xl font-light text-white bg-transparent border-none cursor-pointer px-8 py-5 tracking-wide transition-opacity hover:opacity-65">
                CALL
              </button>
            </div>
            <p className="text-sm text-white/50 text-center pb-4 px-4 leading-relaxed">
              Dial out and reach the unexpected.
            </p>
          </div>

          {/* Availability toggle */}
          
          <div className="flex flex-col gap-2 w-full">
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
    className="w-full py-3 text-[11px] tracking-[0.15em] uppercase text-white/50 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:text-white transition-all"
  >
    {user.is_available ? 'Become unavailable' : 'Become available'}
  </button>

  <button
    onClick={() => {
      localStorage.removeItem('user')
      setLoggedIn(false)
      setUser(null)
    }}
    className="w-full py-3 text-[11px] tracking-[0.15em] uppercase text-white/50 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:text-white transition-all"
  >
    LOG OUT
  </button>
</div>

        </div>

        {/* Footer bar — like Bloom's Trope strip */}
       <div className="absolute bottom-0 left-0 right-0 border-t border-white/[0.07] bg-black/50 backdrop-blur-md px-5 py-3 flex items-center justify-between z-20">
  <a
    href="/about"
    className="text-white text-sm hover:text-gray-400"
  >
    Synopsis
  </a>
  <div className="text-sm text-white tracking-wide">Higher Forces</div>
</div>

        {/* Incoming call modal */}
        {incoming && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="relative bg-[#0e1f3d]/90 border border-white/15 rounded-2xl p-8 w-full max-w-sm text-center mx-4">
              <p className="text-[10px] tracking-[0.3em] uppercase text-white/50 mb-3">incoming call</p>
              <h2 className="text-2xl font-light text-white mb-8">{incoming.caller_name}</h2>
              <div className="flex gap-6 justify-center">
                <button onClick={() => setIncoming(null)} className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center text-xl">✕</div>
                  <span className="text-[10px] tracking-widest text-white/50 uppercase">End</span>
                </button>
                <button onClick={acceptCall} className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-full bg-emerald-400 flex items-center justify-center text-xl text-[#0e1f3d]">↙</div>
                  <span className="text-[10px] tracking-widest text-white/50 uppercase">Answer</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-[#0e1f3d] text-white flex items-center justify-center overflow-hidden">
      <Orbs />

      <div className="relative z-10 text-center flex flex-col items-center gap-10 max-w-xs w-full px-8">

        <div>
          <h1 className="text-5xl font-light tracking-[0.2em] uppercase">CALL CENTER</h1>
          <p className="text-xs tracking-[0.25em] uppercase text-white/50 mt-2">distributed artwork</p>
        </div>

        <div className="w-full flex flex-col gap-3">
          <button
            onClick={() => setShowLogin(true)}
            className="w-full py-3 text-[11px] tracking-[0.2em] uppercase text-white bg-white/10 border border-white/15 rounded-xl hover:bg-white/18 transition-all"
          >
            LOG IN
          </button>
          <button
            onClick={() => setShowRegister(true)}
            className="w-full py-3 text-[11px] tracking-[0.2em] uppercase text-white/50 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:text-white transition-all"
          >
            REGISTER
          </button>
        </div>

        <p className="text-[10px] text-white/30 tracking-widest uppercase">Higher Forces</p>
      </div>

      {showLogin && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#0e1f3d]/90 border border-white/15 rounded-2xl p-8 w-full max-w-sm relative mx-4">
            <button onClick={() => setShowLogin(false)} className="absolute top-4 right-5 text-white/40 hover:text-white text-2xl transition-colors">×</button>
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#0e1f3d]/90 border border-white/15 rounded-2xl p-8 w-full max-w-sm relative mx-4">
            <button onClick={() => setShowRegister(false)} className="absolute top-4 right-5 text-white/40 hover:text-white text-2xl transition-colors">×</button>
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
  onClick={() => {
    const name = (document.querySelector('input[placeholder="Name"]') as HTMLInputElement)?.value.trim()
const phone = (document.querySelector('input[type="tel"]') as HTMLInputElement)?.value.trim()
    if (name && phone) {
      handleRegister(name, phone)
    } else {
      alert('Enter name and phone number')
    }
  }}
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