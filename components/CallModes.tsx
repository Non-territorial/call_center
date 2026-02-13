'use client'

import { LiveKitRoom, AudioConference, RoomAudioRenderer } from '@livekit/components-react'
import '@livekit/components-styles'

interface CallModesProps {
  token: string
  roomName: string
  onEndCall: () => void
}

export default function CallModes({ token, roomName, onEndCall }: CallModesProps) {
  return (
    <LiveKitRoom
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      connect={true}
      audio={true}
      video={false}
      onConnected={() => console.log('Connected to room')}
      onDisconnected={() => console.log('Disconnected')}
      onError={(err) => console.error('LiveKit error:', err)}
    >
      <AudioConference
       />
      <RoomAudioRenderer volume={1.0} />

      <div className="fixed bottom-5 w-full text-center text-xs text-white/40 tracking-widest uppercase">
        In call · Room: {roomName}
      </div>

      <button
        onClick={onEndCall}
        className="fixed bottom-20 left-0 right-0 mx-auto w-40 py-3 text-[11px] tracking-[0.2em] uppercase text-white/50 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:text-white transition-all"
      >
        END CALL
      </button>
    </LiveKitRoom>
  )
}