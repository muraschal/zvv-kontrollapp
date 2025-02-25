import { Redis } from '@upstash/redis';

// Redis Client initialisieren
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
    try {
        switch (req.method) {
            case 'GET':
                // Alle Messungen abrufen
                const data = await redis.get('measurements') || [];
                console.log('GET measurements:', data);
                return res.status(200).json(data);

            case 'POST':
                // Neue Messung speichern
                const measurements = await redis.get('measurements') || [];
                const newMeasurement = req.body;
                measurements.push(newMeasurement);
                await redis.set('measurements', measurements);
                console.log('POST measurement:', newMeasurement);
                return res.status(200).json(newMeasurement);

            case 'DELETE':
                // Authentifizierung prüfen
                const authHeader = req.headers.authorization;
                if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] !== 'satoshi') {
                    return res.status(401).json({ error: 'Nicht autorisiert' });
                }
                // Alle Messungen löschen
                await redis.del('measurements');
                console.log('DELETE measurements');
                return res.status(200).json({ message: 'Alle Messungen gelöscht' });

            default:
                return res.status(405).json({ error: 'Methode nicht erlaubt' });
        }
    } catch (error) {
        console.error('Redis error:', error);
        return res.status(500).json({ error: error.message });
    }
} 