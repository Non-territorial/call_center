'use client'
import { useState, useEffect } from 'react'
import { LiveKitRoom, AudioConference } from '@livekit/components-react'
import '@livekit/components-styles'

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [inCall, setInCall] = useState(false)
  const [token, setToken] = useState('')
  const [roomName, setRoomName] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      setUser(JSON.parse(stored))
      setLoggedIn(true)
    }
  }, [])

  const handleLogin = async (phone: string) => {
    const res = await fetch(`/api/users?phone=${encodeURIComponent(phone)}`)
    if (res.ok) {
      const [foundUser] = await res.json()
      if (foundUser) {
        localStorage.setItem('user', JSON.stringify(foundUser))
        setUser(foundUser)
        setLoggedIn(true)
        setShowLogin(false)
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
    }
  }

  const startRandomCall = async () => {
    if (!user?.id) return
    const res = await fetch(`/api/token?userId=${user.id}`)
    if (!res.ok) return alert('No available users or error')
    const data = await res.json()
    setToken(data.token)
    setRoomName(data.roomName)
    setInCall(true)
  }

  if (inCall && token) {
    return (
      <LiveKitRoom
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        connect={true}
        audio={true}
        video={false}
      >
        <AudioConference />
        <div className="fixed bottom-6 left-0 right-0 text-center text-white">
          In random call • {roomName}
        </div>
      </LiveKitRoom>
    )
  }

  if (loggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-b from-blue-950 to-black text-white p-6">
        <h1 className="text-6xl font-bold mb-2">CALL CENTER</h1>
        <p className="text-2xl opacity-80 mb-12">DISTRIBUTED ARTWORK</p>

        <div className="mb-16 flex items-center gap-3">
          <div className={`w-4 h-4 rounded-full ${user?.is_available ? 'bg-green-400' : 'bg-red-500'}`} />
          <span className="text-xl">{user?.is_available ? 'available' : 'unavailable'}</span>
        </div>

        <div className="w-full max-w-md space-y-10 text-center">
          <p className="text-sm uppercase tracking-widest opacity-70">SELECT MODE</p>

          <div className="grid grid-cols-3 gap-4">
            <button 
              onClick={startRandomCall}
              className="py-6 bg-white/20 backdrop-blur-md rounded-xl hover:bg-white/30 text-lg font-medium"
            >
              Call
            </button>
            <button className="py-6 bg-white/10 backdrop-blur-md rounded-xl text-lg opacity-60">Answer</button>
            <button className="py-6 bg-white/10 backdrop-blur-md rounded-xl text-lg opacity-60">Wander</button>
          </div>

          <p className="text-sm opacity-70">Dial out and reach the unexpected.</p>

          <button
            onClick={async () => {
              const newAvail = !user.is_available
              await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: user.id, is_available: newAvail })
              })
              setUser({ ...user, is_available: newAvail })
            }}
            className="w-full py-5 bg-white/15 backdrop-blur-md rounded-full text-lg font-medium hover:bg-white/25 mt-8"
          >
            {user?.is_available ? 'MAKE YOURSELF UNAVAILABLE' : 'MAKE YOURSELF AVAILABLE'}
          </button>
        </div>

        <button 
          onClick={() => {
            localStorage.removeItem('user')
            setLoggedIn(false)
            setUser(null)
          }} 
          className="mt-16 text-sm opacity-60 underline"
        >
          LOG OUT
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-blue-950 to-black text-white">
      <div className="text-center space-y-12 w-full max-w-md px-6">
        <div>
          <h1 className="text-5xl font-bold mb-2">CALL CENTER</h1>
          <p className="text-xl opacity-80">DISTRIBUTED ARTWORK</p>
        </div>

        <div className="space-y-8">
          <button
            onClick={() => setShowLogin(true)}
            className="w-full py-4 bg-white/10 backdrop-blur-md rounded-full text-lg font-medium hover:bg-white/20"
          >
            LOG IN
          </button>

          <button
            onClick={() => setShowRegister(true)}
            className="w-full py-4 bg-white/5 backdrop-blur-md rounded-full text-lg font-medium hover:bg-white/15"
          >
            REGISTER
          </button>
        </div>

        <p className="text-sm opacity-60">Higher Forces • distributed artwork</p>
      </div>

      {showLogin && (
        <Modal onClose={() => setShowLogin(false)}>
          <LoginForm onSuccess={handleLogin} />
        </Modal>
      )}

      {showRegister && (
        <Modal onClose={() => setShowRegister(false)}>
          <RegisterForm onSuccess={handleRegister} />
        </Modal>
      )}
    </div>
  )
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6">
      <div className="bg-linear-to-b from-blue-950/90 to-black/90 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-6 text-white/60 hover:text-white text-2xl">×</button>
        {children}
      </div>
    </div>
  )
}

function LoginForm({ onSuccess }: { onSuccess: (phone: string) => void }) {
  const [phone, setPhone] = useState('')

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-bold mb-2">Welcome back</h2>
        <p className="text-lg opacity-80">TO THE COLLECTIVE</p>
      </div>
      <input
        type="tel"
        value={phone}
        onChange={e => setPhone(e.target.value)}
        placeholder="your phone number"
        className="w-full p-5 bg-white/10 backdrop-blur-md border-none rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
      />
      <button 
        onClick={() => phone && onSuccess(phone)}
        className="w-full py-5 bg-white/20 backdrop-blur-md rounded-full text-lg font-medium hover:bg-white/30"
      >
        LOG IN
      </button>
    </div>
  )
}

function RegisterForm({ onSuccess }: { onSuccess: (name: string, phone: string) => void }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  return (
    <div className="space-y-8">
      <h2 className="text-4xl font-bold">Register</h2>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Name"
        className="w-full p-5 bg-white/10 backdrop-blur-md border-none rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
      />
      <input
        type="tel"
        value={phone}
        onChange={e => setPhone(e.target.value)}
        placeholder="Phone number"
        className="w-full p-5 bg-white/10 backdrop-blur-md border-none rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
      />
      <button 
        onClick={() => name && phone && onSuccess(name, phone)}
        className="w-full py-5 bg-white/20 backdrop-blur-md rounded-full text-lg font-medium hover:bg-white/30"
      >
        REGISTER
      </button>
    </div>
  )
}