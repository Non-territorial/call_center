// /app/api/register/route.ts
import { NextRequest } from 'next/server';
import { pool } from '../../../db/client';

export async function POST(req: NextRequest) {
  const { name, phone_number } = await req.json();
  const { rows } = await pool.query(
    'INSERT INTO users (name, phone_number) VALUES ($1, $2) RETURNING *',
    [name, phone_number]
  );
  return new Response(JSON.stringify(rows[0]), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}