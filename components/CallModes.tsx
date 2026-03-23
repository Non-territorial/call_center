'use client'
import { useState, useEffect, useRef } from 'react'
import { LiveKitRoom, AudioConference, RoomAudioRenderer, useParticipants } from '@livekit/components-react'
import '@livekit/components-styles'

const PHONE_DESKTOP: React.CSSProperties = { width: 360, height: 780, background: '#000', borderRadius: 32, border: '1px solid rgba(255,255,255,0.18)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }
const PHONE_MOBILE: React.CSSProperties = { width: '100vw', height: '100dvh', background: '#000', borderRadius: 0, border: 'none', overflow: 'hidden', display: 'flex', flexDirection: 'column' }
const RULE: React.CSSProperties = { height: 1, background: 'rgba(255,255,255,0.15)', flexShrink: 0 }
const NUM: React.CSSProperties = { fontFamily: 'Isocpeur, monospace', fontSize: 15, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.04em', minWidth: 24, flexShrink: 0, lineHeight: 1 }
const LBL: React.CSSProperties = { fontFamily: 'Isocpeur, monospace', fontSize: 15, letterSpacing: '0.1em', textTransform: 'uppercase', lineHeight: 1 }

interface CallModesProps {
  token: string
  roomName: string
  onEndCall: () => void
  onRetry: () => void
}

function CallUI({ roomName, onEndCall, onRetry, isMobile }: { roomName: string; onEndCall: () => void; onRetry: () => void; isMobile: boolean }) {
  const participants = useParticipants()
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const otherJoinedRef = useRef(false)
  const [callStatus, setCallStatus] = useState<'calling' | 'connected' | 'declined' | 'no_answer'>('calling')
  const PHONE = isMobile ? PHONE_MOBILE : PHONE_DESKTOP

  // Poll call status so caller knows immediately if declined
  useEffect(() => {
    pollRef.current = setInterval(async () => {
      if (otherJoinedRef.current) {
        if (pollRef.current) clearInterval(pollRef.current)
        return
      }
      try {
        const res = await fetch(`/api/call-status?roomName=${encodeURIComponent(roomName)}`)
        const data = await res.json()
        if (data?.status === 'declined') {
          setCallStatus('declined')
          if (pollRef.current) clearInterval(pollRef.current)
          if (timeoutRef.current) clearTimeout(timeoutRef.current)
          setTimeout(() => onEndCall(), 2500)
        }
      } catch {}
    }, 2000)
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [])

  // Auto-end if nobody joins within 25 seconds
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      if (!otherJoinedRef.current) {
        setCallStatus('no_answer')
        setTimeout(() => onEndCall(), 2500)
      }
    }, 25000)
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }
  }, [])

  // Track participants
  useEffect(() => {
    const others = participants.length - 1
    if (others > 0) {
      otherJoinedRef.current = true
      setCallStatus('connected')
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (pollRef.current) clearInterval(pollRef.current)
    }
    if (otherJoinedRef.current && others === 0) {
      onEndCall()
    }
  }, [participants])

  const statusLabel = () => {
    if (callStatus === 'declined') return { text: 'NO ANSWER', color: 'rgba(255,100,100,0.8)' }
    if (callStatus === 'no_answer') return { text: 'NO ANSWER', color: 'rgba(255,100,100,0.8)' }
    if (callStatus === 'connected') return { text: 'IN CALL', color: 'rgba(120,220,160,0.85)' }
    return { text: 'CALLING...', color: 'rgba(255,255,255,0.45)' }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={PHONE}>
        <div style={{ height: 60, background: '#000', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          <span style={{ fontFamily: 'Isocpeur, monospace', fontSize: 19, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.2em', textTransform: 'uppercase', lineHeight: 1 }}>CALL CENTER</span>
          <span style={{ fontFamily: 'Isocpeur, monospace', fontSize: 8, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.3em', textTransform: 'uppercase' }}>DISTRIBUTED ARTWORK</span>
        </div>
        <div style={{ padding: '0 28px', background: '#000', flexShrink: 0 }}>
          <div style={{ width: '100%', height: 220, overflow: 'hidden', position: 'relative' }}>
            <img src="/curtains.jpeg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center', display: 'block', transform: 'scale(2.2)', filter: 'brightness(0.75)' }} />
          </div>
        </div>
        <div style={{ flex: 1, background: '#000', padding: '0 28px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={RULE} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 28, padding: '16px 0', flexShrink: 0 }}>
            <span style={NUM}>01</span>
            <span style={{ ...LBL, color: statusLabel().color }}>{statusLabel().text}</span>
          </div>
          <div style={RULE} />
          {callStatus === 'connected' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 28, padding: '16px 0', flexShrink: 0 }}>
                <span style={NUM}>02</span>
                <span style={{ fontFamily: 'Isocpeur, monospace', fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{roomName}</span>
              </div>
              <div style={RULE} />
            </>
          )}
          {(callStatus === 'declined' || callStatus === 'no_answer') && (
            <>
              <div onClick={onRetry} style={{ display: 'flex', alignItems: 'center', gap: 28, padding: '16px 0', cursor: 'pointer', flexShrink: 0 }}>
                <span style={NUM}>02</span>
                <span style={{ ...LBL, color: 'rgba(255,255,255,0.72)' }}>CALL AGAIN</span>
              </div>
              <div style={RULE} />
              <div onClick={onEndCall} style={{ display: 'flex', alignItems: 'center', gap: 28, padding: '16px 0', cursor: 'pointer', flexShrink: 0 }}>
                <span style={NUM}>03</span>
                <span style={{ ...LBL, color: 'rgba(255,100,100,0.8)' }}>END</span>
              </div>
            </>
          )}
          {(callStatus === 'calling' || callStatus === 'connected') && (
            <div onClick={onEndCall} style={{ display: 'flex', alignItems: 'center', gap: 28, padding: '16px 0', cursor: 'pointer', flexShrink: 0 }}>
              <span style={NUM}>{callStatus === 'connected' ? '03' : '02'}</span>
              <span style={{ ...LBL, color: 'rgba(255,100,100,0.8)' }}>END CALL</span>
            </div>
          )}
          <div style={RULE} />
        </div>
      </div>
    </div>
  )
}

export default function CallModes({ token, roomName, onEndCall, onRetry }: CallModesProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <LiveKitRoom
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      connect={true}
      audio={true}
      video={false}
      onDisconnected={onEndCall}
    >
      <AudioConference />
      <RoomAudioRenderer volume={1.0} />
      <CallUI roomName={roomName} onEndCall={onEndCall} onRetry={onRetry} isMobile={isMobile} />
    </LiveKitRoom>
  )
}