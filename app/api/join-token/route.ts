import { NextRequest } from 'next/server'
import { AccessToken } from 'livekit-server-sdk'

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId')
  const roomName = req.nextUrl.searchParams.get('roomName')
  if (!userId || !roomName) return new Response('Missing params', { status: 400 })

  const at = new AccessToken(process.env.LIVEKIT_API_KEY!, process.env.LIVEKIT_API_SECRET!, {
    identity: userId
  })
  at.addGrant({ roomJoin: true, room: roomName, canPublish: true, canSubscribe: true })

  const token = await at.toJwt()

  return new Response(JSON.stringify({ token }), { headers: { 'Content-Type': 'application/json' } })
}