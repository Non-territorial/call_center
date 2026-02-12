import { NextRequest } from 'next/server'
import { pool } from '../../../db/client'

export async function POST(req: NextRequest) {
  const { callId, userId } = await req.json()

  await pool.query(
    "UPDATE calls SET status = 'accepted' WHERE id = $1 AND target_id = $2",
    [callId, userId]
  )

  const { rows } = await pool.query('SELECT room_name FROM calls WHERE id = $1', [callId])

  return new Response(JSON.stringify({ roomName: rows[0]?.room_name }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}