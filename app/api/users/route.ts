// /app/api/users/route.ts
import { NextRequest } from 'next/server';
import { pool } from '../../../db/client';

export async function GET(req: NextRequest) {
  const phone = req.nextUrl.searchParams.get('phone');
  if (phone) {
    const { rows } = await pool.query('SELECT * FROM users WHERE phone_number = $1', [phone]);
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const { rows } = await pool.query('SELECT * FROM users ORDER BY id');
  return new Response(JSON.stringify(rows), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function POST(req: NextRequest) {
  const { id, is_available } = await req.json();
  await pool.query('UPDATE users SET is_available=$1 WHERE id=$2', [is_available, id]);
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}