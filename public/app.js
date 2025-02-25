let timer;
let isRunning = false;
let startTime;
let measurements = [];

// Lade gespeicherte Messungen
const savedMeasurements = localStorage.getItem('measurements');
if (savedMeasurements) {
    measurements = JSON.parse(savedMeasurements);
    updateMeasurementsList();
}

const timerDisplay = document.querySelector('.timer');
const startStopBtn = document.getElementById('startStop');
const resetBtn = document.getElementById('reset');
const downloadBtn = document.getElementById('downloadCSV');

console.log('Timer Display:', timerDisplay);
console.log('Start/Stop Button:', startStopBtn);
console.log('Reset Button:', resetBtn);
console.log('Download Button:', downloadBtn);

startStopBtn.addEventListener('click', toggleTimer);
resetBtn.addEventListener('click', resetTimer);
downloadBtn.addEventListener('click', downloadCSV);
document.getElementById('deleteAll').addEventListener('click', deleteAllMeasurements);

// Tab Navigation Logic
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        
        // Add active class to clicked tab
        tab.classList.add('active');
        
        // Show corresponding view
        const view = tab.dataset.view;
        showView(view);
    });
});

function showView(view) {
    // Hide all views
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    
    // Show selected view
    const selectedView = document.querySelector(`.${view}-view`);
    if (selectedView) {
        selectedView.classList.add('active');
    }
}

function toggleTimer() {
    if (!isRunning) {
        if (timer) clearInterval(timer);
        startTime = Date.now();
        timer = setInterval(updateDisplay, 10);
        startStopBtn.textContent = 'Stop';
        isRunning = true;
        timerDisplay.classList.add('running');
    } else {
        clearInterval(timer);
        const elapsed = Date.now() - startTime;
        const duration = elapsed / 1000;
        timerDisplay.classList.remove('running');
        showMediaDialog(duration);
    }
}

function updateDisplay() {
    if (!isRunning) return;
    const elapsed = Date.now() - startTime;
    const ms = elapsed % 1000;
    const seconds = Math.floor(elapsed / 1000) % 60;
    const minutes = Math.floor(elapsed / 60000) % 60;
    const hours = Math.floor(elapsed / 3600000);
    
    timerDisplay.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad3(ms)}`;
}

function pad(number) {
    return number.toString().padStart(2, '0');
}

function pad3(number) {
    return number.toString().padStart(3, '0');
}

function resetTimer() {
    clearInterval(timer);
    timerDisplay.textContent = '00:00:00.000';
    startStopBtn.textContent = 'Start';
    isRunning = false;
}

function downloadCSV() {
    // Excel-kompatibles Format mit BOM
    const BOM = "\uFEFF";
    const csvContent = "data:text/csv;charset=utf-8," + BOM
        + "Zeitstempel,Kontrolldauer (Sekunden),Trägermedium,Kontrollergebnis\n"
        + measurements.map(row => {
            const date = new Date(row.timestamp);
            const formattedDate = date.toLocaleString('de-CH', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZone: 'Europe/Zurich'
            }).replace(/,/g, '');
            
            return `"${formattedDate}",${row.duration},${row.medium},${row.result}`;
        }).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `kontrollzeiten_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Service Worker registrieren
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('ServiceWorker registration successful');
      })
      .catch(err => {
        console.log('ServiceWorker registration failed: ', err);
      });
  });
} 

function updateMeasurementsList() {
    const measurementsList = document.getElementById('measurementsList');
    if (!measurementsList) {
        console.error('Messungsliste nicht gefunden');
        return;
    }

    // Überprüfen ob Messungen vorhanden sind
    if (measurements.length === 0) {
        measurementsList.innerHTML = '<div class="no-measurements">Keine Kontrollen vorhanden</div>';
        return;
    }

    measurementsList.innerHTML = measurements
        .slice(-5)
        .reverse()
        .map(m => {
            const date = new Date(m.timestamp);
            const formattedDate = date.toLocaleString('de-CH', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            const minutes = Math.floor(m.duration / 60);
            const seconds = Math.floor(m.duration % 60);
            const milliseconds = Math.floor((m.duration % 1) * 1000);
            const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
            
            return `
                <div class="measurement-item" onclick="showMeasurementDetails('${m.timestamp}')">
                    <div>Datum: ${formattedDate}</div>
                    <div>Dauer: ${formattedDuration}</div>
                    <div>Medium: ${m.medium}</div>
                    <div class="result ${m.result}">
                        <i class="fas fa-${m.result === 'grün' ? 'check-circle' : 'exclamation-circle'}"></i>
                        Ergebnis: ${m.result}
                    </div>
                    <div class="measurement-arrow">›</div>
                </div>
            `;
        })
        .join('');
} 

async function showMediaDialog(duration, result = null) {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);
    
    // Wenn noch kein Ergebnis gewählt wurde, zeige Trägermedium-Dialog
    if (!result) {
        const mediaDialog = document.getElementById('mediaDialog');
        mediaDialog.classList.remove('hidden');
        
        const mediaButtons = mediaDialog.querySelectorAll('.media-button');
        mediaButtons.forEach(button => {
            button.onclick = async () => {
                const medium = button.dataset.medium;
                mediaDialog.classList.add('hidden');
                
                if (medium !== 'Abgebrochen') {
                    // Nach Trägermedium-Wahl zeige Ergebnis-Dialog
                    showMediaDialog(duration, medium);
                }
                if (medium === 'Abgebrochen') {
                    overlay.remove();
                    resetTimer();
                }
            };
        });
    } else {
        // Zeige Ergebnis-Dialog
        const resultDialog = document.getElementById('resultDialog');
        resultDialog.classList.remove('hidden');
        
        const resultButtons = resultDialog.querySelectorAll('.media-button');
        resultButtons.forEach(button => {
            button.onclick = async () => {
                const kontrollergebnis = button.dataset.result;
                resultDialog.classList.add('hidden');
                overlay.remove();
                
                if (kontrollergebnis !== 'Abgebrochen') {
                    await saveMeasurement(duration, result, kontrollergebnis);
                    updateMeasurementsList();
                }
                resetTimer();
            };
        });
    }
} 

// Neue Funktion für Offline-Speicherung
function saveToLocalStorage(measurement) {
    const offlineMeasurements = JSON.parse(localStorage.getItem('offlineMeasurements') || '[]');
    measurement.synced = false;
    offlineMeasurements.push(measurement);
    localStorage.setItem('offlineMeasurements', JSON.stringify(offlineMeasurements));
}

// Neue Funktion für Synchronisation
async function syncOfflineMeasurements() {
    const offlineMeasurements = JSON.parse(localStorage.getItem('offlineMeasurements') || '[]');
    
    if (offlineMeasurements.length === 0) return;
    
    for (const measurement of offlineMeasurements) {
        try {
            const response = await fetch('/api/measurements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(measurement)
            });
            
            if (response.ok) {
                // Entferne erfolgreich synchronisierte Messung
                const index = offlineMeasurements.indexOf(measurement);
                offlineMeasurements.splice(index, 1);
            }
        } catch (error) {
            console.error('Sync error:', error);
        }
    }
    
    localStorage.setItem('offlineMeasurements', JSON.stringify(offlineMeasurements));
}

// Modifizierte saveMeasurement Funktion
async function saveMeasurement(duration, medium, result) {
    const measurement = {
        timestamp: new Date().toISOString(),
        duration: parseFloat(duration.toFixed(3)),
        medium: medium,
        result: result
    };
    
    try {
        const response = await fetch('/api/measurements', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(measurement)
        });
        
        if (!response.ok) {
            throw new Error('Netzwerkfehler');
        }
        
        const savedMeasurement = await response.json();
        measurements.push(savedMeasurement);
        updateMeasurementsList();
        
    } catch (error) {
        console.error('Fehler beim Speichern:', error);
        saveToLocalStorage(measurement);
        measurements.push(measurement);
        updateMeasurementsList();
    }
}

// Modifizierte loadMeasurements Funktion
async function loadMeasurements() {
    try {
        // Versuche offline Messungen zu synchronisieren
        await syncOfflineMeasurements();
        
        const response = await fetch('/api/measurements');
        if (!response.ok) throw new Error('Netzwerkfehler');
        
        measurements = await response.json();
        
        // Füge nicht synchronisierte Messungen hinzu
        const offlineMeasurements = JSON.parse(localStorage.getItem('offlineMeasurements') || '[]');
        measurements = [...measurements, ...offlineMeasurements];
        
    } catch (error) {
        console.error('Fehler beim Laden:', error);
        const offlineMeasurements = JSON.parse(localStorage.getItem('offlineMeasurements') || '[]');
        measurements = offlineMeasurements;
    }
    
    updateMeasurementsList();
}

// Ersetze die existierende localStorage-Ladeoperation mit:
loadMeasurements(); 

async function deleteAllMeasurements() {
    const password = prompt('Bitte geben Sie das Passwort ein:');
    
    if (!password) {
        return; // Wenn Cancel geklickt wurde
    }
    
    if (password !== 'satoshi') {
        alert('Falsches Passwort');
        return;
    }
    
    if (confirm('Möchten Sie wirklich alle Kontrollen löschen?')) {
        try {
            const response = await fetch('/api/measurements', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${password}`
                }
            });
            
            if (response.status === 401) {
                alert('Nicht autorisiert');
                return;
            }
            
            if (!response.ok) {
                throw new Error('Netzwerkfehler');
            }
            
            measurements = [];
            updateMeasurementsList();
            localStorage.removeItem('measurements');
            localStorage.removeItem('offlineMeasurements');  // Auch Offline-Daten löschen
            
        } catch (error) {
            console.error('Fehler beim Löschen:', error);
            alert('Fehler beim Löschen der Daten');
        }
    }
} 