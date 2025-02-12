const express = require('express');
const path = require('path');
const { Redis } = require('@upstash/redis');
const app = express();
const port = 3001;

// Redis Client initialisieren
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Middleware für JSON-Parsing und CORS
app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Statische Dateien servieren
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.get('/api/measurements', async (req, res) => {
    try {
        const measurements = await redis.get('measurements') || [];
        res.json(measurements);
    } catch (error) {
        console.error('Fehler beim Laden der Messungen:', error);
        res.status(500).json({ error: 'Fehler beim Laden der Messungen' });
    }
});

app.post('/api/measurements', async (req, res) => {
    try {
        const measurement = req.body;
        const measurements = await redis.get('measurements') || [];
        measurements.push(measurement);
        await redis.set('measurements', measurements);
        res.json(measurement);
    } catch (error) {
        console.error('Fehler beim Speichern der Messung:', error);
        res.status(500).json({ error: 'Fehler beim Speichern der Messung' });
    }
});

app.delete('/api/measurements', async (req, res) => {
    try {
        await redis.del('measurements');
        res.json({ message: 'Alle Messungen gelöscht' });
    } catch (error) {
        console.error('Fehler beim Löschen der Messungen:', error);
        res.status(500).json({ error: 'Fehler beim Löschen der Messungen' });
    }
});

app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});

// Vercel serverless function export
module.exports = app;
