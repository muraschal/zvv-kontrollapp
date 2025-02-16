# Kontrollzeit-Erfassungs-App

## 1. Technologie-Stack
- **Frontend:** HTML + JavaScript (Vanilla JS)
- **Backend:** Vercel Serverless Functions
- **Datenspeicherung:** 
  - **Online:** Redis (Upstash)
  - **Offline:** Browser LocalStorage mit Auto-Sync
- **Hosting:** Vercel

## 2. App-Funktionalitäten
### Zeitmessung & Erfassung
- ⏱️ Start/Stop-Button für Zeitmessung
- 🔄 Abbruch-Button für Reset
- 📝 Trägermedien-Auswahl:
  - SwissPass
  - Sicherheitspapier
  - E-Ticket
  - E-Ticket mit Ausweisprüfung

### Datenmanagement
- 📊 Automatische Speicherung in Redis
- 💾 Offline-Fähigkeit mit LocalStorage
- 🔄 Automatische Synchronisation
- 📥 Excel-kompatible CSV-Exports
- 🗑️ Löschen aller gespeicherten Kontrollen

## 3. Datenstruktur
Die Messungen werden in Redis als JSON-Objekte gespeichert:
```json
{
  "timestamp": "2024-02-14T15:30:00.000Z",
  "duration": 12.345,
  "medium": "SwissPass",
  "synced": true
}
```

## 4. Installation & Setup

### Voraussetzungen
- Node.js (Version 14 oder höher)
- Upstash Redis Account

### Lokale Entwicklung
1. Repository klonen:
   ```bash
   git clone https://github.com/muraschal/zvv-kontrollapp.git
   cd zvv-kontrollapp
   ```

2. Dependencies installieren:
   ```bash
   npm install
   ```

3. Umgebungsvariablen setzen:
   - Erstelle eine `.env` Datei
   - Füge die Redis-Credentials hinzu:
     ```
     UPSTASH_REDIS_REST_URL=deine_redis_url
     UPSTASH_REDIS_REST_TOKEN=dein_redis_token
     ```

4. Server starten:
   ```bash
   npm run dev
   ```

### Deployment
Die App ist automatisch mit Vercel verbunden und deployed bei jedem Push auf den main Branch.

## 5. Features
- **Offline-Fähigkeit**: Funktioniert auch ohne Internetverbindung
- **Auto-Sync**: Synchronisiert Offline-Daten automatisch
- **PWA-Support**: Installierbar als Progressive Web App
- **Responsive Design**: Optimiert für mobile Nutzung

## 6. Updates & Changelog
Siehe [CHANGELOG.md](CHANGELOG.md) für eine detaillierte Liste aller Änderungen.
