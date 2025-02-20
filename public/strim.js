const toggleMicrophoneButton = document.getElementById('toggleMicrophone');
let micStream = null;
let mediaRecorder = null;
let isStreaming = false;

// Funkcija za otvaranje i zatvaranje modala
strimButton.addEventListener('click', () => {
    strimkocka.style.display = (strimkocka.style.display === 'none' || strimkocka.style.display === '') 
        ? 'block' : 'none';
});

// Funkcija za startovanje mikrofona
async function startMicrophone() {
    try {
        micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(micStream);
        
        mediaRecorder.ondataavailable = (event) => {
            socket.emit('stream-audio', event.data); // Šaljemo audio podatke serveru
        };
        
        mediaRecorder.start(1000); // Počinje sa slanjem podataka svakih 1 sekundu
        console.log('Počeo audio stream.');
    } catch (error) {
        console.error('Greška pri pokretanju mikrofona:', error);
    }
}

// Dugme za pokretanje mikrofona
toggleMicrophoneButton.addEventListener('click', async () => {
    if (!isStreaming) {
        await startMicrophone();
        isStreaming = true;
    } else {
        mediaRecorder.stop();
        micStream.getTracks().forEach(track => track.stop());
        micStream = null;
        mediaRecorder = null;
        isStreaming = false;
        console.log('Mikrofon isključen.');
    }
});
// Prijem audio podataka od DJ-a
socket.on('stream-audio', (audioData) => {
    const audio = new Audio(URL.createObjectURL(audioData)); // Kreiramo URL za stream
    audio.play(); // Igra audio stream
});
