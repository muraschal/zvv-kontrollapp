# ZVV Kontrollapp

Eine Progressive Web App (PWA) zur Zeitmessung von Billett-Kontrollen.

## Features

- Präzise Zeitmessung von Kontrollen
- Erfassung des Trägermediums (SwissPass, E-Ticket, etc.)
- Erfassung des Kontrollergebnisses (grün/orange)
- Statistiken und Auswertungen
- Offline-Funktionalität
- Installation als App möglich
- Visuelle Rückmeldung durch Farben und Animationen
- Dynamischer Hintergrund während aktiver Kontrolle

## Zugriff
Die App ist unter [kontrolle.zvv.ch](https://kontrolle.zvv.ch) erreichbar.

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
- **Frontend:** Vanilla JavaScript, CSS3
- **Backend:** Node.js mit Express
- **Datenbank:** Redis
- **Hosting:** Vercel
- **Features:**
  - PWA mit Service Worker
  - Lottie Animationen für dynamische Effekte

## Setup

### Voraussetzungen
- Node.js
- Redis

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

3. Redis Server starten:
```bash
redis-server
```

4. App starten:
```bash
npm start
```

## Entwicklung

- `npm run dev` für Entwicklungsserver
- `npm run build` für Produktions-Build

## Die Geschichte

### �� Ursprung & Vision
Die ZVV Kontrollapp entstand aus einem praktischen Bedürfnis: Die präzise Erfassung von Kontrollzeiten im öffentlichen Verkehr. Was als einfacher Timer begann, entwickelte sich zu einer vollwertigen Progressive Web App.

### 🛠 Technische Evolution
- **Phase 1: Grundlagen** (v1.0.0)
  - Einfacher Timer mit Start/Stop
  - Lokale Datenspeicherung
  - Basis-UI

- **Phase 2: Cloud & Sync** (v1.1.0-1.2.0)
  - Integration von Redis für zentrale Datenspeicherung
  - Offline-Funktionalität mit Service Worker
  - Verbesserte UI mit Tab-Navigation

- **Phase 3: Professionalisierung** (v1.3.0+)
  - Trägermedium-Erfassung (SwissPass, E-Ticket)
  - Kontrollergebnis-Tracking (Grün/Orange)
  - Excel-kompatible CSV-Exports
  - Echtzeit-Synchronisation
  - Statistische Auswertungen

### 🎯 Kernprinzipien
- **Einfachheit:** Fokus auf das Wesentliche
- **Zuverlässigkeit:** Offline-first Architektur
- **Effizienz:** Schnelle, präzise Zeiterfassung
- **Datensicherheit:** Zentrale, sichere Speicherung

### 📱 Von Native zu PWA
Ursprünglich als native iOS-App geplant, fiel die Entscheidung bewusst für eine PWA:
- Plattformunabhängigkeit
- Einfache Wartung
- Schnelle Updates
- Breite Zugänglichkeit

### 🔄 Continuous Improvement
Die App wird kontinuierlich verbessert, basierend auf:
- Benutzer-Feedback
- Technischen Innovationen
- Betrieblichen Anforderungen

## Version
Aktuelle Version: 1.3.3