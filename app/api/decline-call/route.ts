// app/api/decline-call/route.ts
import { NextRequest } from 'next/server'
import { pool } from '../../../db/client'

export async function POST(req: NextRequest) {
  const { callId, userId } = await req.json()

  await pool.query(
    "UPDATE calls SET status = 'declined' WHERE id = $1 AND target_id = $2",
    [callId, userId]
  )

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}