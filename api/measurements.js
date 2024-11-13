import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const { timestamp, duration, medium } = req.body;
      const result = await sql`
        INSERT INTO measurements (timestamp, duration, medium)
        VALUES (${timestamp}, ${duration}::decimal(10,3), ${medium})
        RETURNING *
      `;
      return res.status(200).json(result.rows[0]);
    }
    
    if (req.method === 'GET') {
      const { rows } = await sql`
        SELECT * FROM measurements 
        ORDER BY timestamp DESC 
        LIMIT 5
      `;
      return res.status(200).json(rows);
    }
    
    if (req.method === 'DELETE') {
      await sql`TRUNCATE TABLE measurements`;
      return res.status(200).json({ message: 'Alle Messungen gelöscht' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
} 