'use client';
import { useEffect, useState } from 'react';

export default function UserAvailability() {
  const [user, setUser] = useState<any>(null);
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const toggle = async () => {
    if (!user) return;
    const newAvail = !available;
    await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: user.id, is_available: newAvail })
    });
    setAvailable(newAvail);
  };

  if (!user) return null;

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={toggle}
        className="w-3/4 py-3 text-[11px] tracking-[0.15em] uppercase text-white/50 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:text-white transition-all"
      >
        {available ? 'MAKE YOURSELF UNAVAILABLE' : 'MAKE YOURSELF AVAILABLE'}
      </button>
      <p className={`text-[10px] tracking-widest uppercase transition-opacity ${available ? 'text-emerald-400 opacity-100' : 'opacity-0'}`}>
        Available
      </p>
    </div>
  );
}