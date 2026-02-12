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
    <form onSubmit={handleSubmit} className="space-y-4 flex flex-col items-center">
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="input-glass w-3/4" required />
      <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone Number" className="input-glass w-3/4" required />
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="input-glass w-3/4" required />
      <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="input-glass w-3/4" type="password" required />
      <button type="submit" className="button-glass">Register</button>
    </form>
  );
}