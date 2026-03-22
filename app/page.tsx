'use client'
import { useState, useEffect } from 'react'
import CallModes from '@/components/CallModes'
import '@livekit/components-styles'

const PHONE: React.CSSProperties = {
  width: 360,
  height: 780,
  background: '#000',
  borderRadius: 32,
  border: '1px solid rgba(255,255,255,0.18)',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
}

// Zoomed-in curtains — same image but cropped to feel different from the background
const ZOOM_IMG: React.CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  objectPosition: 'center center',
  display: 'block',
  transform: 'scale(2.2) translateY(8%)',
  filter: 'brightness(0.75)',
}

const RULE: React.CSSProperties = { height: 1, background: 'rgba(255,255,255,0.15)', flexShrink: 0 }
const NUM: React.CSSProperties = { fontFamily: 'Isocpeur, monospace', fontSize: 15, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.04em', minWidth: 24, flexShrink: 0, lineHeight: 1 }
const LBL: React.CSSProperties = { fontFamily: 'Isocpeur, monospace', fontSize: 15, letterSpacing: '0.1em', textTransform: 'uppercase', lineHeight: 1 }
const INPUT: React.CSSProperties = { width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.2)', fontFamily: 'Isocpeur, monospace', fontSize: 15, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.1em', padding: '8px 0', outline: 'none', textTransform: 'uppercase' }
const FIELD_LBL: React.CSSProperties = { fontFamily: 'Isocpeur, monospace', fontSize: 10, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: 10, display: 'block' }

function Row({ num, label, onClick, color }: { num: string; label: string; onClick?: () => void; color?: string }) {
  return (
    <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 28, padding: '16px 0', cursor: onClick ? 'pointer' : 'default', flexShrink: 0 }}>
      <span style={NUM}>{num}</span>
      <span style={{ ...LBL, color: color ?? 'rgba(255,255,255,0.72)' }}>{label}</span>
    </div>
  )
}

function TopBar() {
  return (
    <div style={{ height: 60, background: '#000', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
      <span style={{ fontFamily: 'Isocpeur, monospace', fontSize: 19, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.2em', textTransform: 'uppercase', lineHeight: 1 }}>CALL CENTER</span>
      <span style={{ fontFamily: 'Isocpeur, monospace', fontSize: 8, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.3em', textTransform: 'uppercase' }}>DISTRIBUTED ARTWORK</span>
    </div>
  )
}

function ZoomedCurtains() {
  return (
    <div style={{ padding: '0 28px', background: '#000', flexShrink: 0 }}>
      <div style={{ width: '100%', height: 220, overflow: 'hidden', position: 'relative' }}>
        <img src="/curtains.jpeg" alt="" style={ZOOM_IMG} />
      </div>
    </div>
  )
}

function List({ children }: { children: React.ReactNode }) {
  return <div style={{ flex: 1, background: '#000', padding: '0 28px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>{children}</div>
}

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [loggedIn, setLoggedIn] = useState(false)
  const [view, setView] = useState<'home' | 'login' | 'register'>('home')
  const [inCall, setInCall] = useState(false)
  const [token, setToken] = useState('')
  const [roomName, setRoomName] = useState('')
  const [incoming, setIncoming] = useState<any>(null)
  const [loginPhone, setLoginPhone] = useState('')
  const [regName, setRegName] = useState('')
  const [regPhone, setRegPhone] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) { const u = JSON.parse(stored); setUser(u); setLoggedIn(true) }
  }, [])

  useEffect(() => {
    if (!user?.id || inCall) return
    const interval = setInterval(async () => {
      const res = await fetch(`/api/incoming?userId=${user.id}`)
      const data = await res.json()
      if (data && data.caller_id !== user.id) setIncoming(data)
    }, 5000)
    return () => clearInterval(interval)
  }, [user, inCall])

  const handleLogin = async () => {
    const res = await fetch(`/api/users?phone=${encodeURIComponent(loginPhone)}`)
    if (res.ok) {
      const [found] = await res.json()
      if (found) { localStorage.setItem('user', JSON.stringify(found)); setUser(found); setLoggedIn(true); setView('home') }
      else alert('No user found')
    }
  }

  const handleRegister = async () => {
    const res = await fetch('/api/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: regName, phone_number: regPhone }) })
    if (res.ok) {
      const u = await res.json()
      localStorage.setItem('user', JSON.stringify(u)); setUser(u); setLoggedIn(true); setView('home')
    } else alert('Registration failed')
  }

  const startCall = async () => {
    if (!user?.id) return
    const res = await fetch(`/api/token?userId=${user.id}`)
    if (!res.ok) { alert('No available users online'); return }
    const data = await res.json()
    if (!data.token || !data.roomName) { alert('No available users online'); return }
    setToken(data.token); setRoomName(data.roomName); setInCall(true)
  }

  const acceptCall = async () => {
    if (!incoming || !user?.id) return
    const res = await fetch('/api/accept-call', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ callId: incoming.id, userId: user.id }) })
    const { roomName: rn } = await res.json()
    const tokenRes = await fetch(`/api/join-token?userId=${user.id}&roomName=${encodeURIComponent(rn)}`)
    const { token: tk } = await tokenRes.json()
    setToken(tk); setRoomName(rn); setInCall(true); setIncoming(null)
  }

  const toggleAvailability = async () => {
    const newVal = !user.is_available
    await fetch('/api/users', { method: 'POST', body: JSON.stringify({ id: user.id, is_available: newVal }), headers: { 'Content-Type': 'application/json' } })
    const updated = { ...user, is_available: newVal }
    setUser(updated); localStorage.setItem('user', JSON.stringify(updated))
  }

  if (inCall && token) return <CallModes token={token} roomName={roomName} onEndCall={() => setInCall(false)} />

  if (loggedIn) return (
    <div style={PHONE}>
      <TopBar />
      <ZoomedCurtains />
      <List>
        <div style={RULE} />
        <Row num="01" label="CALL" onClick={startCall} />
        <div style={RULE} />
        <Row num="02" label={user.is_available ? 'AVAILABLE' : 'UNAVAILABLE'} color={user.is_available ? 'rgba(120,220,160,0.85)' : 'rgba(255,100,100,0.8)'} />
        <div style={RULE} />
        <Row num="03" label={user.is_available ? 'BECOME UNAVAILABLE' : 'BECOME AVAILABLE'} onClick={toggleAvailability} />
        <div style={RULE} />
        <Row num="04" label="LOG OUT" onClick={() => { localStorage.removeItem('user'); setLoggedIn(false); setUser(null) }} />
        <div style={RULE} />
        <Row num="05" label="SYNOPSIS" onClick={() => window.location.href = '/about'} />
        <div style={RULE} />
        <Row num="06" label="HIGHER FORCES" onClick={() => window.open('https://higherforces.art', '_blank')} />
        <div style={RULE} />
      </List>

      {incoming && (
        <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, backgroundImage: 'url(/curtains.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div style={PHONE}>
            <TopBar />
            <ZoomedCurtains />
            <List>
              <div style={RULE} />
              <div style={{ padding: '20px 0' }}>
                <span style={FIELD_LBL}>INCOMING CALL</span>
                <span style={{ ...LBL, color: 'rgba(255,255,255,0.72)' }}>{incoming.caller_name}</span>
              </div>
              <div style={RULE} />
              <div style={{ display: 'flex' }}>
                <div onClick={() => setIncoming(null)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 0', cursor: 'pointer' }}>
                  <span style={{ ...LBL, color: 'rgba(255,100,100,0.8)' }}>DECLINE</span>
                </div>
                <div style={{ width: 1, background: 'rgba(255,255,255,0.15)' }} />
                <div onClick={acceptCall} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 0', cursor: 'pointer' }}>
                  <span style={{ ...LBL, color: 'rgba(120,220,160,0.85)' }}>ANSWER</span>
                </div>
              </div>
              <div style={RULE} />
            </List>
          </div>
        </div>
      )}
    </div>
  )

  if (view === 'login') return (
    <div style={PHONE}>
      <TopBar />
      <ZoomedCurtains />
      <List>
        <div style={RULE} />
        <div style={{ padding: '24px 0' }}>
          <span style={FIELD_LBL}>PHONE NUMBER</span>
          <input type="tel" value={loginPhone} onChange={e => setLoginPhone(e.target.value)} placeholder="+ _ _ _  _ _ _  _ _ _ _" style={INPUT} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
        </div>
        <div style={RULE} />
        <Row num="01" label="LOG IN" onClick={handleLogin} />
        <div style={RULE} />
        <Row num="02" label="BACK" onClick={() => setView('home')} color="rgba(255,255,255,0.35)" />
        <div style={RULE} />
      </List>
    </div>
  )

  if (view === 'register') return (
    <div style={PHONE}>
      <TopBar />
      <ZoomedCurtains />
      <List>
        <div style={RULE} />
        <div style={{ padding: '24px 0', display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div>
            <span style={FIELD_LBL}>NAME</span>
            <input value={regName} onChange={e => setRegName(e.target.value)} placeholder="YOUR NAME" style={INPUT} />
          </div>
          <div>
            <span style={FIELD_LBL}>PHONE NUMBER</span>
            <input type="tel" value={regPhone} onChange={e => setRegPhone(e.target.value)} placeholder="+ _ _ _  _ _ _  _ _ _ _" style={INPUT} />
          </div>
        </div>
        <div style={RULE} />
        <Row num="01" label="REGISTER" onClick={handleRegister} />
        <div style={RULE} />
        <Row num="02" label="BACK" onClick={() => setView('home')} color="rgba(255,255,255,0.35)" />
        <div style={RULE} />
      </List>
    </div>
  )

  return (
    <div style={PHONE}>
      <TopBar />
      <ZoomedCurtains />
      <List>
        <div style={RULE} />
        <Row num="01" label="LOG IN" onClick={() => setView('login')} />
        <div style={RULE} />
        <Row num="02" label="REGISTER" onClick={() => setView('register')} />
        <div style={RULE} />
        <Row num="03" label="SYNOPSIS" onClick={() => window.location.href = '/about'} />
        <div style={RULE} />
        <Row num="04" label="HIGHER FORCES" onClick={() => window.open('https://higherforces.art', '_blank')} />
        <div style={RULE} />
      </List>
    </div>
  )
}