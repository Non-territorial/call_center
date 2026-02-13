'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PhoneLogin() {
  const [phone, setPhone] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/users?phone=' + encodeURIComponent(phone))
    if (res.ok) {
      const users = await res.json()
      if (users.length > 0) {
        localStorage.setItem('user', JSON.stringify(users[0]))
        router.push('/main')
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6 w-full">
      <h1 className="text-3xl font-light tracking-wide text-white">Welcome back</h1>
      <input
        value={phone}
        onChange={e => setPhone(e.target.value)}
        placeholder="your phone number"
        className="w-3/4 p-4 bg-white/6 border border-white/12 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/30 text-sm tracking-wide transition-colors"
        required
      />
      <button
        type="submit"
        className="w-3/4 py-3 text-[11px] tracking-[0.2em] uppercase text-[#0e1f3d] bg-white rounded-xl hover:opacity-85 transition-opacity"
      >
        ENTER
      </button>
    </form>
  )
}