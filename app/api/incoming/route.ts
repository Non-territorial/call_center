import { NextRequest } from 'next/server'
import { pool } from '../../../db/client'

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId')
  if (!userId) return new Response('Missing userId', { status: 400 })

  const { rows } = await pool.query(
    `SELECT c.id, c.caller_id, c.room_name, u.name AS caller_name 
     FROM calls c 
     JOIN users u ON c.caller_id = u.id 
     WHERE c.target_id = $1 AND c.status = 'pending' 
     ORDER BY c.created_at DESC LIMIT 1`,
    [userId]
  )

  return new Response(JSON.stringify(rows[0] || null), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}