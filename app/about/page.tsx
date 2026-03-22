'use client'

const PHONE: React.CSSProperties = { width: 360, height: 780, background: '#000', borderRadius: 32, border: '1px solid rgba(255,255,255,0.18)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }
const RULE: React.CSSProperties = { height: 1, background: 'rgba(255,255,255,0.15)', flexShrink: 0 }
const NUM: React.CSSProperties = { fontFamily: 'Isocpeur, monospace', fontSize: 15, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.04em', minWidth: 24, flexShrink: 0, lineHeight: 1 }
const LBL: React.CSSProperties = { fontFamily: 'Isocpeur, monospace', fontSize: 15, letterSpacing: '0.1em', textTransform: 'uppercase', lineHeight: 1 }

function Row({ num, label, onClick, color }: { num: string; label: string; onClick?: () => void; color?: string }) {
  return (
    <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 28, padding: '16px 0', cursor: onClick ? 'pointer' : 'default', flexShrink: 0 }}>
      <span style={NUM}>{num}</span>
      <span style={{ ...LBL, color: color ?? 'rgba(255,255,255,0.72)' }}>{label}</span>
    </div>
  )
}

export default function About() {
  return (
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

      <div style={{ flex: 1, background: '#000', padding: '0 28px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={RULE} />
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0' }}>
          {[
            'You call and somebody answers. For a moment, you believe you have reached the wrong person. Then, more disturbing, the possibility crosses your mind that you have reached exactly the right one.',
            'Neither of you hangs up.',
            'The entire architecture of modern communication exists to eliminate friction — to ensure every call reaches its intended recipient with maximum efficiency. What the system produces is the perfect simulation of communication. The channel functions. And yet nothing is exchanged that was not already anticipated before the call was placed.',
            'CALL CENTER arises from the opposite premise. The call goes somewhere you cannot fully see, toward a person you did not select, in conditions neither of you prepared for.',
            'The form is open not because it is undefined, but because its constraints are precisely calibrated to prevent repetition. The algorithm does not guarantee surprise — it makes surprise structurally probable.',
            'Every call is an instantiation. The work is the condition. The system does not answer what happens next. That is the point.',
          ].map((p, i) => (
            <p key={i} style={{ fontFamily: 'Isocpeur, monospace', fontSize: 14, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.06em', lineHeight: 1.75, margin: '0 0 16px' }}>{p}</p>
          ))}
        </div>
        <div style={{ paddingTop: 20 }}>
        <div style={RULE} />
        <Row num="01" label="BACK" onClick={() => window.location.href = '/'} color="rgba(255,255,255,0.35)" />
        <div style={RULE} />
        <Row num="02" label="HIGHER FORCES" onClick={() => window.open('https://higherforces.art', '_blank')} />
        <div style={RULE} />
        <div style={{ height: 20 }} />
        </div>
      </div>

    </div>
  )
}