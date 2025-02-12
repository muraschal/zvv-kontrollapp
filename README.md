# Kontrollzeit-Erfassungs-App

## 1. Technologie-Stack
- **Frontend:** HTML + JavaScript (React optional)
- **Backend:** Node.js + Express
- **Datenspeicherung:** Redis (Upstash)
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

### Datenexport & Verwaltung
- 📊 Automatische CSV-Generierung nach jeder Messung
- 💾 Download-Button für CSV-Datei
- 🗑️ Löschen aller gespeicherten Kontrollen
- 📈 Excel-kompatibles Format

## 3. Datenstruktur
Die Messungen werden in Redis gespeichert und enthalten:
- Zeitstempel
- Kontrolldauer (in Sekunden)
- Gewähltes Trägermedium

## 4. Installation & Setup

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

## 5. Updates & Changelog
Siehe [CHANGELOG.md](CHANGELOG.md) für eine detaillierte Liste aller Änderungen.
