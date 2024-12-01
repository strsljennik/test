// Proveravamo da li korisnik već ima UUID
let userUUID = localStorage.getItem('userUUID');

// Ako nemamo UUID, kreiramo novi i čuvamo ga u localStorage
if (!userUUID) {
    userUUID = generateUUID();
    localStorage.setItem('userUUID', userUUID);
}

// Funkcija za generisanje UUID
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Funkcija za slanje podataka serveru
async function sendGuestData(nickname) {
    try {
        const response = await fetch('/guests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nickname: nickname, uuid: userUUID })
        });

        const result = await response.json();
        console.log('Odgovor servera:', result);
    } catch (error) {
        console.error('Greška pri slanju podataka:', error);
    }
}

// Na primer, poziv funkcije sa nekim nickname-om
sendGuestData('Gost123');
