'use client';
import { useState } from 'react';

export default function RegisterForm({ onRegistered }: { onRegistered: () => void }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone_number: phone, email, password })
    });
    onRegistered();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full">
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Name"
        className="w-3/4 p-4 bg-white/6 border border-white/12 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/30 text-sm tracking-wide transition-colors"
        required
      />
      <input
        value={phone}
        onChange={e => setPhone(e.target.value)}
        placeholder="Phone Number"
        className="w-3/4 p-4 bg-white/6 border border-white/12 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/30 text-sm tracking-wide transition-colors"
        required
      />
      <button
        type="submit"
        className="w-3/4 py-3 text-[11px] tracking-[0.2em] uppercase text-[#0e1f3d] bg-white rounded-xl hover:opacity-85 transition-opacity mt-2"
      >
        Register
      </button>
    </form>
  );
}