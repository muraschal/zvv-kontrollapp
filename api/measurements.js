import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const { timestamp, duration, medium } = req.body;
      await sql`
        INSERT INTO measurements (timestamp, duration, medium)
        VALUES (${timestamp}, ${duration}, ${medium})
      `;
      return res.status(200).json({ success: true });
    }
    
    if (req.method === 'GET') {
      const { rows } = await sql`
        SELECT * FROM measurements 
        ORDER BY timestamp DESC 
        LIMIT 5
      `;
      return res.status(200).json(rows);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
} 