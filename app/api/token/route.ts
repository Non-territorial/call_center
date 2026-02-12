import { NextRequest, NextResponse } from 'next/server';
import { AccessToken } from 'livekit-server-sdk';
import { pool } from '../../../db/client';

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId'); // current logged user id
  if (!userId) return new Response('Missing userId', { status: 400 });

  // Find random available other user
  const { rows } = await pool.query(
    `SELECT id, phone_number FROM users 
     WHERE id != $1 AND is_available = true 
     ORDER BY RANDOM() LIMIT 1`,
    [userId]
  );

  const targetUser = rows[0];
  if (!targetUser) return new Response('No available users', { status: 404 });

  const roomName = `call-${Math.random().toString(36).slice(2)}`; // unique room

  const at = new AccessToken(process.env.LIVEKIT_API_KEY!, process.env.LIVEKIT_API_SECRET!, {
    identity: userId.toString(),
  });
  at.addGrant({ roomJoin: true, room: roomName, canPublish: true, canSubscribe: true });

  const token = await at.toJwt();

  return new Response(JSON.stringify({ token, roomName, targetPhone: targetUser.phone_number }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}