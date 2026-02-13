import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // or POSTGRES_URL, etc.
  ssl: { rejectUnauthorized: false } // if needed for your host
});

export async function GET() {
  try {
    await pool.query(`DELETE FROM calls WHERE created_at < NOW() - INTERVAL '7 days'`);
    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Cleanup failed' }, { status: 500 });
  }
}