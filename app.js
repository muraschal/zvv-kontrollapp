let timer;
let isRunning = false;
let startTime;
let measurements = [];

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

function toggleTimer() {
    if (!isRunning) {
        startTime = Date.now();
        timer = setInterval(updateDisplay, 10);
        startStopBtn.textContent = 'Stop';
        isRunning = true;
        timerDisplay.classList.add('running');
    } else {
        clearInterval(timer);
        const duration = Math.round((Date.now() - startTime) / 1000);
        timerDisplay.classList.remove('running');
        showMediaDialog(duration);
    }
}

function updateDisplay() {
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
    if (measurements.length === 0) return;

    const csvContent = "data:text/csv;charset=utf-8," 
        + "Zeitstempel,Kontrolldauer (Sekunden),Trägermedium\n"
        + measurements.map(row => `${row.timestamp},${row.duration},${row.medium}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "kontrollzeiten.csv");
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
        .slice(-5) // Zeigt nur die letzten 5 Messungen
        .reverse() // Neueste zuerst
        .map(m => {
            const date = new Date(m.timestamp);
            const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
            const duration = `${Math.floor(m.duration / 60)}:${(m.duration % 60).toString().padStart(2, '0')}`;
            return `
                <div class="measurement-item" onclick="showMeasurementDetails('${m.timestamp}')">
                    <div>Datum: ${formattedDate}</div>
                    <div>Dauer: ${duration} min</div>
                    <div>Medium: ${m.medium}</div>
                    <div class="measurement-arrow">›</div>
                </div>
            `;
        })
        .join('');
} 

function showMediaDialog(duration) {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);
    
    const mediaDialog = document.getElementById('mediaDialog');
    mediaDialog.classList.remove('hidden');
    
    const mediaButtons = mediaDialog.querySelectorAll('.media-button');
    mediaButtons.forEach(button => {
        button.onclick = () => {
            const medium = button.dataset.medium;
            if (medium !== 'Abgebrochen') {
                saveMeasurement(duration, medium);
                updateMeasurementsList();
            }
            mediaDialog.classList.add('hidden');
            overlay.remove();
            resetTimer();
        };
    });
} 