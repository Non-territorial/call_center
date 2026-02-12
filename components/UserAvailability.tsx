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
    <div className="flex flex-col items-center space-y-4">
      <button onClick={toggle} className="button-glass w-3/4">
        {available ? 'MAKE YOURSELF UNAVAILABLE' : 'MAKE YOURSELF AVAILABLE'}
      </button>
      <p className="text-green-400">{available ? 'Available' : ''}</p>
    </div>
  );
}