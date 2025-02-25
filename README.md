# ZVV Kontrollapp

Eine Progressive Web App (PWA) zur Erfassung von Kontrollzeiten für den ZVV.

## Features
- ⏱️ Präzise Zeitmessung
- 📱 PWA mit Offline-Support
- 💾 Redis-basierte Datenspeicherung
- 📊 CSV-Export der Messungen
- 🔄 Echtzeit-Synchronisation

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
