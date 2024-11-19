const storage = require('node-persist');
const path = require('path');

let isStorageInitialized = false;

// Funkcija za generisanje podrazumevanog `nickname`
function generateDefaultNickname() {
    return `gost-${Math.floor(1000 + Math.random() * 9000)}`; // Format: gost-<broj>
}

// Inicijalizacija skladišta
async function initializeStorage() {
    if (isStorageInitialized) return; // Ako je već inicijalizovano, ne ponavljaj

    try {
        await storage.init({
            dir: path.join(__dirname, 'cuvati'),
            fileName: 'gosti.json',
            stringify: JSON.stringify,
            parse: JSON.parse,
            forgiveParseErrors: true // Ignoriši greške pri parsiranju
        });
        isStorageInitialized = true; // Postavi na true nakon uspešne inicijalizacije
        console.log('Skladište je uspešno inicijalizovano.');
    } catch (error) {
        console.error('Greška pri inicijalizaciji skladišta:', error);
    }
}

// Sačuvaj podatke gosta
async function saveGuestData(nickname = null, color = null) {
    try {
        await initializeStorage(); // Osiguraj da je skladište inicijalizovano

        // Ako nije prosleđen `nickname`, generiši podrazumevani
        if (!nickname) {
            nickname = generateDefaultNickname();
        }

        // Učitaj sve goste
        const allGuests = await loadAllGuests();

        // Proveri da li gost već postoji
        const existingGuest = allGuests.find(guest => guest.nickname === nickname);

        if (existingGuest) {
            // Ažuriraj boju gosta ako je prosleđena nova vrednost
            if (color) {
                existingGuest.color = color;
            } else {
                color = existingGuest.color; // Zadrži prethodnu boju
            }
        } else {
            // Dodaj novog gosta ako ne postoji
            const newGuest = { nickname, color: color || 'default' }; // Defaultna boja ako nije prosleđena
            allGuests.push(newGuest);
        }

        // Sačuvaj ažurirani niz gostiju
        await storage.setItem('guests', allGuests);
        console.log(`Podaci za gosta sa nadimkom ${nickname} su sačuvani:`, { nickname, color });
    } catch (err) {
        console.error(`Greška prilikom čuvanja podataka za gosta ${nickname}:`, err);
    }
}

// Učitaj sve goste
async function loadAllGuests() {
    try {
        await initializeStorage(); // Osiguraj da je skladište inicijalizovano
        const allGuests = await storage.getItem('guests'); // Učitaj niz svih gostiju
        return allGuests || []; // Vraća prazan niz ako nema gostiju
    } catch (err) {
        console.error('Greška prilikom učitavanja svih gostiju:', err);
        return []; // Vraćaj prazan niz u slučaju greške
    }
}

// Prikaz svih gostiju kada se server pokrene
async function displayAllGuests() {
    const guests = await loadAllGuests();
    if (guests.length === 0) {
        console.log('Nema gostiju. Dodajte goste!');
    } else {
        console.log('Svi gosti:', guests);
    }
}

// Inicijalizacija storage-a pre korišćenja drugih funkcija
initializeStorage().then(() => {
    // Prikaz svih gostiju nakon inicijalizacije
    displayAllGuests();
}).catch(err => {
    console.error('Greška pri inicijalizaciji storage-a:', err);
});

// Izvoz funkcija
module.exports = {
    saveGuestData,
    loadAllGuests,
    initializeStorage
};
