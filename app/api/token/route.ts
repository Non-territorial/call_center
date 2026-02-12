import { NextRequest } from 'next/server'
import { AccessToken } from 'livekit-server-sdk'
import { pool } from '../../../db/client'

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId')
  if (!userId) return new Response('Missing userId', { status: 400 })

  const { rows } = await pool.query(
    `SELECT id FROM users 
     WHERE id != $1 AND is_available = true 
     ORDER BY RANDOM() LIMIT 1`,
    [userId]
  )

  if (!rows[0]) return new Response('No available users', { status: 404 })

  const targetId = rows[0].id
  const roomName = `call-${Date.now()}-${Math.random().toString(36).slice(2)}`

  await pool.query(
    'INSERT INTO calls (caller_id, target_id, room_name, status) VALUES ($1, $2, $3, $4)',
    [userId, targetId, roomName, 'pending']
  )

  const at = new AccessToken(process.env.LIVEKIT_API_KEY!, process.env.LIVEKIT_API_SECRET!, {
    identity: userId
  })
  at.addGrant({ roomJoin: true, room: roomName, canPublish: true, canSubscribe: true })

  const token = await at.toJwt()

  return new Response(JSON.stringify({ token, roomName, targetId }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}