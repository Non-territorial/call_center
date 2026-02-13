// app/about/page.tsx
'use client'
import { useEffect } from 'react'

export default function About() {
  useEffect(() => {
    console.log('About page loaded')
  }, [])

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

  return (
    <div className="relative min-h-screen bg-[#0e1f3d] text-white flex flex-col items-center justify-center p-6 overflow-hidden">
      <Orbs />

      <div className="relative z-10 max-w-xs w-full text-left flex flex-col gap-6">
        <h1 className="text-4xl font-light uppercase text-center mb-6">SYNOPSIS</h1>
        
        <p className="text-sm leading-relaxed opacity-90">
          “Call Center” is a distributed art piece that strives on serendipity and unexpected encounters to bring about unforeseen experiences.
        </p>
        
        <p className="text-sm leading-relaxed opacity-90">
          You dial the number of someone you know yet somebody else answers. Perhaps you called the wrong number, you think. For a moment, it crosses your mind that maybe you are talking with the right person, but you soon realise that you have a cross connection.
        </p>
        
        <p className="text-sm leading-relaxed opacity-90">
          You also get the impression that this person was awaiting a call. Maybe the person on the other side noticed that you just wanted to talk. Neither of you hangs up.
        </p>
        
        <p className="text-sm leading-relaxed opacity-90">
          No accounts, no profiles, no persistence beyond availability status. Pure transient encounter.
        </p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 border-t border-white/[0.07] bg-black/50 backdrop-blur-md px-5 py-3 flex items-center justify-between z-20">
        <a href="/" className="text-white text-sm hover:text-gray-400">Back</a>
        <div className="text-sm text-white tracking-wide">Higher Forces</div>
      </div>
    </div>
  )
}