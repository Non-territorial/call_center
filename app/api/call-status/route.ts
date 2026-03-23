// app/api/call-status/route.ts
import { NextRequest } from 'next/server'
import { pool } from '../../../db/client'

export async function GET(req: NextRequest) {
  const roomName = req.nextUrl.searchParams.get('roomName')
  if (!roomName) return new Response('Missing roomName', { status: 400 })

  const { rows } = await pool.query(
    'SELECT status FROM calls WHERE room_name = $1 ORDER BY created_at DESC LIMIT 1',
    [roomName]
  )

  return new Response(JSON.stringify(rows[0] || null), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}