'use client';
import { useState } from 'react';
import { LiveKitRoom, AudioConference } from '@livekit/components-react';
import '@livekit/components-styles';

export default function CallModes() {
  const [inCall, setInCall] = useState(false);
  const [token, setToken] = useState('');
  const [roomName, setRoomName] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const startCall = async () => {
    const res = await fetch(`/api/token?userId=${user.id}`);
    if (!res.ok) {
      alert('No available users or error');
      return;
    }
    const data = await res.json();
    setToken(data.token);
    setRoomName(data.roomName);
    setInCall(true);
  };

  if (inCall && token && roomName) {
    return (
      <LiveKitRoom
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        connect={true}
        audio={true}
        video={false}
      >
        <AudioConference />
        <div className="fixed bottom-5 w-full text-center text-xs text-white/40 tracking-widest uppercase">
          In call · Room: {roomName}
        </div>
      </LiveKitRoom>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {/* Bloom-style main verb button — matches the Call verb in page.tsx */}
      <div className="w-full border-t border-b border-white/13 py-1">
        <div className="flex justify-center">
          <button
            onClick={startCall}
            className="text-2xl font-light text-white bg-transparent border-none cursor-pointer px-8 py-5 tracking-wide transition-opacity hover:opacity-65"
          >
            CALL
          </button>
        </div>
      </div>
    </div>
  );
}