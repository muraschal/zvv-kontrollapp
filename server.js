const express = require('express');
const path = require('path');
const app = express();
const port = 3001;

// Middleware für JSON-Parsing
app.use(express.json());

// Statische Dateien servieren
app.use(express.static(path.join(__dirname, 'public')));

// In-Memory Datenbank
let measurements = [];

// GET /api/measurements
app.get('/api/measurements', (req, res) => {
    res.json(measurements);
});

// POST /api/measurements
app.post('/api/measurements', (req, res) => {
    const measurement = req.body;
    measurements.push(measurement);
    res.json(measurement);
});

// DELETE /api/measurements
app.delete('/api/measurements', (req, res) => {
    measurements = [];
    res.json({ message: 'Alle Messungen gelöscht' });
});

app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});
