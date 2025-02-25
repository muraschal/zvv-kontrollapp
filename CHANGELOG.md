# Changelog

Alle wichtigen Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

## [Unreleased]

## [1.2.0] - 2024-02-15
### Added
- Tab-Navigation mit drei Bereichen (Zeit, Admin, ZVV)
- Verbesserte UI-Struktur mit separaten Views
- Font Awesome Icons für Navigation
- Responsive Footer-Positionierung

### Changed
- Neu strukturierte Benutzeroberfläche
- Admin-Funktionen in separatem Tab
- Verbesserte mobile Ansicht
- Optimierte Z-Index Hierarchie

### Fixed
- Überlappungsprobleme zwischen Footer und Navigation
- View-Management verbessert
- Konsistente Darstellung auf allen Geräten

## [1.1.0] - 2024-02-14
### Added
- Vollständige Redis-Integration mit Upstash
- Offline-Funktionalität mit LocalStorage
- Automatische Synchronisation von Offline-Daten
- Verbesserte Fehlerbehandlung bei Netzwerkproblemen
- Excel-kompatibles CSV-Format mit BOM

### Changed
- Umstellung von lokaler Speicherung auf Redis
- Verbessertes Error Handling
- Optimierte Datenstruktur für Messungen

### Fixed
- Memory Leak im Timer behoben
- Verbesserte Datensynchronisation
- Korrekte Behandlung von Offline-Messungen

## [1.0.1] - 2024-02-12
### Changed
- Hintergrundbild von externer URL zu lokalem Asset (`gfx/bg.jpg`) geändert

## [1.0.0] - 2024-02-05
### Added
- Initiale Version der Kontrollzeit-Erfassungs-App
- Zeitmessung mit Start/Stop Funktionalität
- Trägermedien-Auswahl (SwissPass, Sicherheitspapier, E-Ticket)
- CSV-Export Funktion
- Responsive Design für mobile Nutzung 