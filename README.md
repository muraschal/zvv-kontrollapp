# ZVV Kontrollapp

Eine Progressive Web App (PWA) zur Erfassung von Kontrollzeiten für den ZVV.

## Features
- ⏱️ Präzise Zeitmessung
- 📱 PWA mit Offline-Support
- 💾 Redis-basierte Datenspeicherung
- 📊 CSV-Export der Messungen
- 🔄 Echtzeit-Synchronisation

## Technische Details

### API Endpoints
```
GET    /api/measurements       # Alle Messungen abrufen
POST   /api/measurements      # Neue Messung speichern
DELETE /api/measurements      # Alle Messungen löschen (Auth required)
GET    /api/measurements/download  # CSV-Export aller Messungen
```

### Datenstruktur
```json
{
  "timestamp": "2024-02-25T13:14:00.000Z",
  "duration": 0.617,
  "medium": "SwissPass",
  "result": "grün"
}
```

### Technologie-Stack
- **Frontend:** Vanilla JavaScript, HTML5, CSS3
- **Backend:** Node.js, Express
- **Datenbank:** Upstash Redis
- **Hosting:** Vercel
- **Features:**
  - Service Worker für Offline-Funktionalität
  - Auto-Sync bei Netzwerk-Wiederherstellung
  - Real-time Updates zwischen Geräten
  - Excel-kompatible CSV-Exports

## Setup

### Voraussetzungen
- Node.js
- Redis (Upstash)

### Installation
1. Repository klonen:
```bash
git clone https://github.com/muraschal/zvv-kontrollapp.git
cd zvv-kontrollapp
```

2. Dependencies installieren:
```bash
npm install
```

3. `.env` Datei erstellen:
```env
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
PORT=3002
```

4. Development Server starten:
```bash
npm run dev
```

## Deployment
Die App ist auf Vercel deployed und nutzt Upstash Redis für die Datenspeicherung.

## Version
Aktuelle Version: 1.3.2
