let timer;
let isRunning = false;
let startTime;
let measurements = [];
let chartType = 'bar'; // oder 'line'

const timerDisplay = document.querySelector('.timer');
const startStopBtn = document.getElementById('startStop');
const downloadBtn = document.getElementById('downloadCSV');

console.log('Timer Display:', timerDisplay);
console.log('Start/Stop Button:', startStopBtn);
console.log('Download Button:', downloadBtn);

startStopBtn.addEventListener('click', toggleTimer);
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
        
        // Aktualisiere die Liste beim Wechsel zum Timer-Tab
        if (view === 'timer') {
            loadMeasurements();
        }
    });
});

// Regelmäßige Aktualisierung der Liste (alle 30 Sekunden)
setInterval(() => {
    // Nur aktualisieren wenn Timer-Tab aktiv ist
    if (document.querySelector('.timer-view').classList.contains('active')) {
        loadMeasurements();
    }
}, 30000);

// Aktualisiere auch beim Fokus-Wechsel (Tab/Fenster Aktivierung)
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && 
        document.querySelector('.timer-view').classList.contains('active')) {
        loadMeasurements();
    }
});

function showView(view) {
    // Hide all views
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    
    // Show selected view
    const selectedView = document.querySelector(`.${view}-view`);
    if (selectedView) {
        selectedView.classList.add('active');
        // Update stats when switching to admin view
        if (view === 'admin') {
            updateStatistics();
            // Re-attach event listener for chart toggle
            const toggleBtn = document.getElementById('toggleChart');
            if (toggleBtn) {
                toggleBtn.onclick = () => {
                    chartType = chartType === 'bar' ? 'line' : 'bar';
                    // Update button icon
                    const icon = toggleBtn.querySelector('i');
                    icon.className = chartType === 'bar' 
                        ? 'fas fa-chart-line' 
                        : 'fas fa-chart-bar';
                    updateStatistics();
                };
            }
        }
    }
}

function toggleTimer() {
    if (!isRunning) {
        if (timer) clearInterval(timer);
        startTime = Date.now();
        timer = setInterval(updateDisplay, 10);
        startStopBtn.textContent = 'Stopp';
        isRunning = true;
        timerDisplay.classList.add('running');
        startStopBtn.classList.add('running');
        document.querySelector('.timer-card').classList.add('active-control');
        document.querySelector('.background-animation').classList.add('active');
    } else {
        clearInterval(timer);
        const elapsed = Date.now() - startTime;
        const duration = elapsed / 1000;
        timerDisplay.classList.remove('running');
        startStopBtn.classList.remove('running');
        document.querySelector('.timer-card').classList.remove('active-control');
        document.querySelector('.background-animation').classList.remove('active');
        startStopBtn.textContent = 'Start';
        showMediaDialog(duration);
    }
}

function updateDisplay() {
    if (!isRunning) return;
    const elapsed = Date.now() - startTime;
    const ms = elapsed % 1000;
    const seconds = Math.floor(elapsed / 1000) % 60;
    const minutes = Math.floor(elapsed / 60000);
    
    timerDisplay.textContent = `${pad(minutes)}:${pad(seconds)}.${pad3(ms)}`;
}

function pad(number) {
    return number.toString().padStart(2, '0');
}

function pad3(number) {
    return number.toString().padStart(3, '0');
}

// CSV Download Handler ersetzen
document.getElementById('downloadCSV').addEventListener('click', async () => {
    window.location.href = '/api/measurements/download';
});

// Service Worker registrieren
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    // Zuerst alle Service Worker registrierungen finden und updaten
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
        await registration.unregister();
    }
    
    // Cache leeren
    const cacheNames = await caches.keys();
    await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
    );

    // Service Worker neu registrieren
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
        measurementsList.innerHTML = '<div class="no-measurements">Keine Kontrollen in den letzten 5 Messungen</div>';
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
            
            // Nur Fallback wenn result wirklich undefined oder null ist
            const result = (m.result === undefined || m.result === null) ? 'Abgebrochen' : m.result;
            const resultIcon = result === 'grün' ? 'check-circle' : 
                             result === 'orange' ? 'exclamation-circle' : 
                             'times-circle';
            const resultClass = result === 'Abgebrochen' ? 'cancelled' : result;
            
            return `
                <div class="measurement-item" onclick="showMeasurementDetails('${m.timestamp}')">
                    <div>Datum: ${formattedDate}</div>
                    <div>Dauer: ${formattedDuration}</div>
                    <div>Medium: ${m.medium}</div>
                    <div class="result ${resultClass}">
                        <i class="fas fa-${resultIcon}"></i>
                        Ergebnis: ${result}
                    </div>
                    <div class="measurement-arrow">›</div>
                </div>
            `;
        })
        .join('');
} 

function resetTimer() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
    timerDisplay.textContent = '00:00.000';
    timerDisplay.classList.remove('running');
    startStopBtn.classList.remove('running');
    document.querySelector('.timer-card').classList.remove('active-control');
    document.querySelector('.background-animation').classList.remove('active');
    isRunning = false;
}

async function showMediaDialog(duration, result = null) {
    // Entferne alle existierenden Overlays
    document.querySelectorAll('.overlay').forEach(el => el.remove());
    
    // Erstelle neues Overlay
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);
    
    // Wenn noch kein Ergebnis gewählt wurde, zeige Trägermedium-Dialog
    if (!result) {
        // Verstecke beide Dialoge zunächst
        document.getElementById('resultDialog').classList.add('hidden');
        const mediaDialog = document.getElementById('mediaDialog');
        mediaDialog.classList.remove('hidden');
        
        const mediaButtons = mediaDialog.querySelectorAll('.media-button');
        mediaButtons.forEach(button => {
            button.onclick = async () => {
                const medium = button.dataset.medium;
                mediaDialog.classList.add('hidden');
                
                if (medium === 'Abgebrochen') {
                    overlay.remove();
                    resetTimer();
                } else {
                    // Nach Trägermedium-Wahl zeige Ergebnis-Dialog
                    showMediaDialog(duration, medium);
                }
            };
        });
    } else {
        // Verstecke beide Dialoge zunächst
        document.getElementById('mediaDialog').classList.add('hidden');
        const resultDialog = document.getElementById('resultDialog');
        resultDialog.classList.remove('hidden');
        
        const resultButtons = resultDialog.querySelectorAll('.media-button');
        resultButtons.forEach(button => {
            button.onclick = async () => {
                const kontrollergebnis = button.dataset.result;
                resultDialog.classList.add('hidden');
                overlay.remove();
                
                // Speichern, außer bei Abbruch
                if (kontrollergebnis === 'Abgebrochen') {
                    resetTimer();
                    return;
                }
                
                await saveMeasurement(duration, result, kontrollergebnis);
                updateMeasurementsList();
                
                // Timer zurücksetzen
                clearInterval(timer);
                timerDisplay.textContent = '00:00.000';
                startStopBtn.textContent = 'Start';
                isRunning = false;
            };
        });
    }
} 

async function saveMeasurement(duration, medium, result) {
    // Debug-Log
    console.log('Saving measurement:', { duration, medium, result });
    
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
        console.log('Saved measurement:', savedMeasurement);
        
        measurements.push(savedMeasurement);
        updateMeasurementsList();
        
    } catch (error) {
        console.error('Fehler beim Speichern:', error);
        alert('Fehler beim Speichern der Messung. Bitte überprüfen Sie Ihre Internetverbindung.');
    }
}

async function loadMeasurements() {
    try {
        const response = await fetch('/api/measurements');
        if (!response.ok) throw new Error('Netzwerkfehler');
        
        measurements = await response.json();
        console.log('Loaded measurements from Redis:', measurements);
        
    } catch (error) {
        console.error('Fehler beim Laden:', error);
        measurements = [];
        alert('Fehler beim Laden der Messungen. Bitte überprüfen Sie Ihre Internetverbindung.');
    }
    
    updateMeasurementsList();
}

// Ersetze die existierende localStorage-Ladeoperation mit:
loadMeasurements(); 

async function deleteAllMeasurements() {
    const password = prompt('Bitte geben Sie das Passwort ein:');
    
    if (!password) {
        return;
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
            
            console.log('Delete response:', response.status, await response.text());
            
            if (response.status === 401) {
                alert('Nicht autorisiert');
                return;
            }
            
            if (!response.ok) {
                throw new Error('Netzwerkfehler');
            }
            
            measurements = [];
            updateMeasurementsList();
            alert('Alle Messungen wurden erfolgreich gelöscht');
            
        } catch (error) {
            console.error('Fehler beim Löschen:', error);
            alert('Fehler beim Löschen der Daten');
        }
    }
} 

// Neue Funktion für Statistik-View
function updateStatistics() {
    const ctx = document.getElementById('statsChart');
    document.getElementById('totalControls').textContent = measurements.length;
    
    // Sicherstellen dass Messungen vorhanden sind
    if (!measurements || measurements.length === 0) {
        document.getElementById('avgTime').textContent = '-';
        document.getElementById('minTime').textContent = '-';
        document.getElementById('maxTime').textContent = '-';
        return;
    }
    
    // Existierendes Chart zerstören falls vorhanden
    if (window.myChart) {
        window.myChart.destroy();
        window.myChart = null;
    }
    
    const chartData = chartType === 'bar' 
        ? calculateAveragesByMedium()
        : calculateTimelineData();

    // Update chart title based on type
    document.querySelector('.chart-title').textContent = 
        chartType === 'bar' 
            ? 'Durchschnittliche Kontrollzeit' 
            : 'Kontrolldauer';

    window.myChart = new Chart(ctx, {
        type: chartType,
        data: {
            labels: chartType === 'bar' 
                ? chartData.map(d => d.medium)
                : chartData.data.map(d => d.time),
            datasets: [
                {
                    label: ' ', // Leeres Label für die Legende
                    data: chartType === 'bar'
                        ? chartData.map(d => d.avg.toFixed(2))
                        : chartData.data.map(d => d.duration),
                    backgroundColor: chartType === 'bar' ? ['#0479cc', '#34c759', '#ff9500'] : '#0479cc',
                    borderColor: chartType === 'line' ? '#0479cc' : undefined,
                    tension: 0.3
                }
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 10,
                    right: 30,
                    top: 20,
                    bottom: 10
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    display: true,
                    grid: {
                        display: true,
                        drawBorder: true,
                        drawOnChartArea: true,
                        drawTicks: true
                    },
                    ticks: {
                        maxRotation: 0,
                        minRotation: 0,
                        autoSkip: false,
                        font: {
                            family: '"ZVV Brown Narrow S Web Regular", sans-serif',
                            size: 14
                        }
                    },
                    title: {
                        display: true,
                        text: chartType === 'bar' ? 'Trägermedium' : 'Zeit',
                        font: {
                            family: '"ZVV Brown Narrow S Web Regular", sans-serif',
                            size: 14
                        }
                    }
                },
                y: {
                    display: true,
                    beginAtZero: true,
                    grid: {
                        display: true,
                        drawBorder: true,
                        drawOnChartArea: true,
                        drawTicks: true
                    },
                    ticks: {
                        stepSize: 2,
                        font: {
                            family: '"ZVV Brown Narrow S Web Regular", sans-serif',
                            size: 14
                        }
                    },
                    title: {
                        display: true,
                        text: 'Sekunden',
                        font: {
                            family: '"ZVV Brown Narrow S Web Regular", sans-serif',
                            size: 14
                        }
                    }
                }
            }
        }
    });

    // Update summary stats
    updateSummaryStats();
}

function updateSummaryStats() {
    const allDurations = measurements.map(m => m.duration);
    const avg = allDurations.reduce((a,b) => a + b, 0) / allDurations.length;
    const min = Math.min(...allDurations);
    const max = Math.max(...allDurations);
    const sortedDurations = [...allDurations].sort((a, b) => a - b);
    const median = sortedDurations[Math.floor(sortedDurations.length / 2)];
    
    const greenCount = measurements.filter(m => m.result === 'grün').length;
    const orangeCount = measurements.filter(m => m.result === 'orange').length;

    document.getElementById('avgTime').textContent = `${avg.toFixed(2)}s`;
    document.getElementById('minTime').textContent = `${min.toFixed(2)}s`;
    document.getElementById('maxTime').textContent = `${max.toFixed(2)}s`;
    document.getElementById('medianTime').textContent = median.toFixed(2) + 's';
    document.getElementById('greenCount').textContent = greenCount;
    document.getElementById('orangeCount').textContent = orangeCount;
}

// Durchschnittszeiten berechnen
function calculateAveragesByMedium() {
    const groups = {};
    measurements.forEach(m => {
        if (!groups[m.medium]) groups[m.medium] = [];
        groups[m.medium].push(m.duration);
    });
    
    return Object.entries(groups).map(([medium, times]) => ({
        medium,
        avg: times.reduce((a,b) => a + b, 0) / times.length
    }));
}

function calculateTimelineData() {
    const sortedDurations = [...measurements]
        .sort((a, b) => a.duration - b.duration);
    const median = sortedDurations[Math.floor(sortedDurations.length / 2)].duration;

    return {
        data: measurements
            .slice(-20)
            .map(m => ({
                time: new Date(m.timestamp).toLocaleTimeString('de-CH', {
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                duration: m.duration
            })),
        median: median
    };
}

// Initialize background animation
window.addEventListener('DOMContentLoaded', () => {
    lottie.loadAnimation({
        container: document.body,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: '/gfx/zvv-animation-01.json',
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
            className: 'background-animation'
        }
    });
}); 