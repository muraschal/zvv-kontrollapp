import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  try {
    // Test Redis-Verbindung
    const ping = await redis.ping();
    if (ping !== 'PONG') {
      throw new Error('Redis-Verbindung fehlgeschlagen');
    }
    
    if (req.method === 'POST') {
      const { timestamp, duration, medium, synced = true } = req.body;
      
      // Validierung
      if (!timestamp || !duration || !medium) {
        return res.status(400).json({ error: 'Fehlende Pflichtfelder' });
      }
      
      if (duration <= 0 || duration > 7200) {
        return res.status(400).json({ error: 'Ungültige Dauer' });
      }

      const measurement = { timestamp, duration, medium, synced };
      
      // Hole aktuelle Messungen
      const measurements = await redis.get('measurements') || [];
      measurements.push(measurement);
      
      // Speichere aktualisierte Liste
      await redis.set('measurements', measurements);
      
      return res.status(200).json(measurement);
    }
    
    if (req.method === 'GET') {
      const measurements = await redis.get('measurements') || [];
      // Sortiere nach Zeitstempel, neueste zuerst
      measurements.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      return res.status(200).json(measurements.slice(0, 50));
    }
    
    if (req.method === 'DELETE') {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authentifizierung erforderlich' });
      }
      
      const password = authHeader.split(' ')[1];
      
      if (password !== 'satoshi') {
        return res.status(401).json({ error: 'Nicht autorisiert' });
      }
      
      try {
        await redis.del('measurements');
        return res.status(200).json({ message: 'Alle Messungen gelöscht' });
      } catch (error) {
        console.error('Fehler beim Löschen:', error);
        return res.status(500).json({ error: 'Fehler beim Löschen der Daten' });
      }
    }
  } catch (error) {
    console.error('Redis error:', error);
    return res.status(500).json({ error: error.message });
  }
} 