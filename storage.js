const storage = require('node-persist');
const path = require('path');

let isStorageInitialized = false;

async function initializeStorage() {
    if (isStorageInitialized) 
        return; // Ako je već inicijalizovano, ne ponavljaj
    
  try {
        await storage.init({
            dir: path.join(__dirname, 'gosti'), // Promeni 'data' u 'gosti'
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
async function saveGuestData(guestId, nickname, color = 'default') {
    try {
        const guestData = { nickname, color };
        await storage.setItem(guestId, guestData); 
        console.log(`Podaci za gosta ${guestId} su sačuvani.`);
    } catch (err) {
        console.error(`Greška prilikom čuvanja podataka za gosta ${guestId}:`, err);
    }
}

// Učitaj podatke gosta
async function loadGuestData(guestId) {
    try {
        const guestData = await storage.getItem(guestId); 
        if (!guestData) {
            console.warn(`Podaci za gosta ${guestId} nisu pronađeni.`);
        }
        return guestData;
    } catch (err) {
        console.error(`Greška prilikom učitavanja podataka za gosta ${guestId}:`, err);
    }
}

// Obriši podatke gosta
async function deleteGuestData(guestId) {
    try {
        await storage.removeItem(guestId); 
        console.log(`Podaci za gosta ${guestId} su obrisani.`);
    } catch (err) {
        console.error(`Greška prilikom brisanja podataka za gosta ${guestId}:`, err);
    }
}

// Učitaj sve goste
async function loadAllGuests() {
    try {
        const allGuestKeys = await storage.keys(); // Učitaj ključeve svih gostiju
        const allGuests = {};

        // Za svaku ključu, učitaj podatke
        for (const key of allGuestKeys) {
            allGuests[key] = await storage.getItem(key);
        }

        return allGuests; // Vraća sve goste kao objekat
    } catch (err) {
        console.error('Greška prilikom učitavanja svih gostiju:', err);
    }
}

// Prikaz svih gostiju kada se server pokrene
async function displayAllGuests() {
    const guests = await loadAllGuests();
    console.log('Svi gosti:', guests);
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
    loadGuestData,
    deleteGuestData,
    loadAllGuests,
    initializeStorage
};
