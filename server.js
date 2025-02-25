require('dotenv').config();
const express = require('express');
const path = require('path');
const { Redis } = require('@upstash/redis');
const app = express();
const port = process.env.PORT || 3000;

// Redis Client initialisieren
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Teste Redis-Verbindung
redis.ping().then(() => {
    console.log('Redis connection successful', {
        url: process.env.UPSTASH_REDIS_REST_URL,
        // Token verstecken, nur die ersten 5 Zeichen zeigen
        token: process.env.UPSTASH_REDIS_REST_TOKEN?.substring(0, 5) + '...'
    });
}).catch(err => {
    console.error('Redis connection failed:', {
        error: err.message,
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN?.substring(0, 5) + '...'
    });
});

// Middleware für JSON-Parsing und CORS
app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
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
        console.log('Loading measurements...');
        const measurements = await redis.get('measurements') || [];
        console.log('Loaded measurements:', measurements.length);
        res.json(measurements);
    } catch (error) {
        console.error('Fehler beim Laden der Messungen:', {
            error: error.message,
            stack: error.stack
        });
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

app.get('/api/measurements/download', async (req, res) => {
    try {
        console.log('Fetching measurements from Redis...');
        const measurements = await redis.get('measurements') || [];
        console.log('Fetched measurements:', measurements);
        
        // CSV Header
        const csvRows = ['Zeitstempel,Kontrolldauer (Sekunden),Trägermedium,Kontrollergebnis'];
        
        // Daten formatieren
        measurements.forEach(m => {
            const date = new Date(m.timestamp);
            const formattedDate = date.toLocaleString('de-CH', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZone: 'Europe/Zurich'
            }).replace(/,/g, '');
            
            const result = m.result || 'Abgebrochen';
            csvRows.push(`"${formattedDate}",${m.duration},"${m.medium}","${result}"`);
        });

        console.log('Generated CSV rows:', csvRows);
        // CSV Response
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename=kontrolldauer_${new Date().toISOString().split('T')[0]}.csv`);
        res.send('\uFEFF' + csvRows.join('\n')); // BOM für Excel

    } catch (error) {
        console.error('Detailed error:', error);
        console.error('CSV Download Error:', error);
        res.status(500).json({ error: 'Fehler beim CSV-Download' });
    }
});

// Excel-Download-Endpunkt
app.get('/api/measurements/download/excel', async (req, res) => {
    try {
        console.log('Fetching measurements for Excel export...');
        const measurements = await redis.get('measurements') || [];
        
        // Excel.js für die Excel-Generierung verwenden
        const ExcelJS = require('exceljs');
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Kontrolldauer');
        
        // Spalten definieren
        worksheet.columns = [
            { header: 'Zeitstempel', key: 'timestamp', width: 20 },
            { header: 'Kontrolldauer (Sekunden)', key: 'duration', width: 20 },
            { header: 'Trägermedium', key: 'medium', width: 25 },
            { header: 'Kontrollergebnis', key: 'result', width: 15 }
        ];
        
        // Überschriften formatieren
        worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0479CC' } }; // ZVV Blau
        
        // Daten hinzufügen
        measurements.forEach(m => {
            const date = new Date(m.timestamp);
            const formattedDate = date.toLocaleString('de-CH', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZone: 'Europe/Zurich'
            });
            
            const result = m.result || 'Abgebrochen';
            
            // Zeile hinzufügen
            const row = worksheet.addRow({
                timestamp: formattedDate,
                duration: m.duration,
                medium: m.medium,
                result: result
            });
            
            // Ergebnis-Zelle formatieren
            const resultCell = row.getCell('result');
            if (result === 'grün') {
                resultCell.font = { color: { argb: 'FF008000' } }; // Grün
            } else if (result === 'orange') {
                resultCell.font = { color: { argb: 'FFFF9800' } }; // Orange
            } else if (result === 'Abgebrochen') {
                resultCell.font = { color: { argb: 'FFFF0000' } }; // Rot
            }
        });
        
        // Automatische Filter für die Tabelle
        worksheet.autoFilter = {
            from: { row: 1, column: 1 },
            to: { row: measurements.length + 1, column: 4 }
        };
        
        // Excel-Datei als Buffer generieren
        const buffer = await workbook.xlsx.writeBuffer();
        
        // Als Download senden
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=kontrolldauer_${new Date().toISOString().split('T')[0]}.xlsx`);
        res.send(buffer);
        
    } catch (error) {
        console.error('Excel Download Error:', error);
        res.status(500).json({ error: 'Fehler beim Excel-Download' });
    }
});

app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});

// Vercel serverless function export
module.exports = app;
