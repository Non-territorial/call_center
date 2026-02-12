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
        <div style={{ position: 'fixed', bottom: 20, width: '100%', textAlign: 'center' }}>
          In call • Room: {roomName}
        </div>
      </LiveKitRoom>
    );
  }

  return (
    <div className="space-y-4 text-center">
      <button onClick={startCall} className="button-glass py-6 text-2xl w-3/4">
        CALL
      </button>
    </div>
  );
}