let timer;
let isRunning = false;
let startTime;
let measurements = [];

const timerDisplay = document.querySelector('.timer');
const startStopBtn = document.getElementById('startStop');
const resetBtn = document.getElementById('reset');
const downloadBtn = document.getElementById('downloadCSV');

startStopBtn.addEventListener('click', toggleTimer);
resetBtn.addEventListener('click', resetTimer);
downloadBtn.addEventListener('click', downloadCSV);

function toggleTimer() {
    console.log('Timer wurde geklickt!');
    if (!isRunning) {
        // Timer starten
        startTime = Date.now();
        timer = setInterval(updateDisplay, 1000);
        startStopBtn.textContent = 'Stop';
        isRunning = true;
    } else {
        // Timer stoppen und Messung speichern
        clearInterval(timer);
        const duration = Math.round((Date.now() - startTime) / 1000);
        const medium = document.querySelector('input[name="medium"]:checked').value;
        
        measurements.push({
            timestamp: new Date().toISOString(),
            duration: duration,
            medium: medium
        });

        startStopBtn.textContent = 'Start';
        isRunning = false;
    }
}

function updateDisplay() {
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    const hours = Math.floor(elapsed / 3600);
    const minutes = Math.floor((elapsed % 3600) / 60);
    const seconds = elapsed % 60;
    
    timerDisplay.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function pad(number) {
    return number.toString().padStart(2, '0');
}

function resetTimer() {
    clearInterval(timer);
    timerDisplay.textContent = '00:00:00';
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