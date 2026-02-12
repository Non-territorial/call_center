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
    <form onSubmit={handleSubmit} className="space-y-6 flex flex-col items-center">
      <h1 className="text-4xl">Welcome back</h1>
      <input
        value={phone}
        onChange={e => setPhone(e.target.value)}
        placeholder="your phone number"
        className="input-glass w-3/4"
        required
      />
      <button type="submit" className="button-glass w-3/4">ENTER</button>
    </form>
  )
}