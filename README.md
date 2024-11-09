# Kontrollzeit-Erfassungs-App

## 1. Technologie-Stack
- **Frontend:** HTML + JavaScript (React optional)
- **Datenspeicherung:** Browser-basierte CSV-Generierung
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

### Datenexport
- 📊 Automatische CSV-Generierung nach jeder Messung
- 💾 Download-Button für CSV-Datei
- 📈 Excel-kompatibles Format

## 3. Datenstruktur
Die CSV-Datei enthält:
- Zeitstempel
- Kontrolldauer (in Sekunden)
- Gewähltes Trägermedium
