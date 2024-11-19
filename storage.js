const storage = require('node-persist');
const path = require('path');

let isStorageInitialized = false;

// Inicijalizacija skladišta
async function initializeStorage() {
    if (isStorageInitialized) 
        return; // Ako je već inicijalizovano, ne ponavljaj

    try {
        await storage.init({
            dir: path.join(__dirname, 'gosti'), 
            fileName: 'gosti.json',
            stringify: JSON.stringify, 
            parse: JSON.parse 
        });
        isStorageInitialized = true; // Postavi na true nakon uspešne inicijalizacije
        console.log('Skladište je uspešno inicijalizovano.');
    } catch (error) {
        console.error('Greška pri inicijalizaciji skladišta:', error);
    }
}

// Sačuvaj podatke gosta
async function saveGuestData(nickname, color = 'default') {
    try {
        const guestData = { nickname, color };
        const allGuests = await loadAllGuests() || []; // Učitaj sve goste kao niz
        allGuests.push(guestData); // Dodaj novog gosta u niz
        await storage.setItem('guests', allGuests); // Sačuvaj niz gostiju
        console.log(`Podaci za gosta sa nadimkom ${nickname} su sačuvani:`, guestData);
    } catch (err) {
        console.error(`Greška prilikom čuvanja podataka za gosta ${nickname}:`, err);
    }
}

// Učitaj sve goste
async function loadAllGuests() {
    try {
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
