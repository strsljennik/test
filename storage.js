const storage = require('node-persist');
const path = require('path');

// Osiguraj da je storage inicijalizovan pre nego što koristiš bilo koje funkcije
async function initializeStorage() {
    try {
        await storage.init({
            dir: path.join(__dirname, 'data'), // Folder gde će se podaci čuvati
            // Postavi naziv datoteke
            fileName: 'gosti.json',
            stringify: JSON.stringify, // Kako čuvamo podatke pravimo JSON string
            parse: JSON.parse // Kako učitavamo podatke pretvaramo JSON string u objekat
        });
        console.log('Storage je uspešno inicijalizovan.');
    } catch (err) {
        console.error('Greška prilikom inicijalizacije storage-a:', err);
    }
}

// Sačuvaj podatke gosta
async function saveGuestData(guestId, nickname, color = 'default') {
    try {
        const guestData = { nickname, color };
        await storage.setItem(guestId, guestData); // Asinhrono čuvanje
        console.log(`Podaci za gosta ${guestId} su sačuvani.`);
    } catch (err) {
        console.error(`Greška prilikom čuvanja podataka za gosta ${guestId}:`, err);
    }
}

// Učitaj podatke gosta
async function loadGuestData(guestId) {
    try {
        const guestData = await storage.getItem(guestId); // Asinhrono učitavanje
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
        await storage.removeItem(guestId); // Asinhrono brisanje
        console.log(`Podaci za gosta ${guestId} su obrisani.`);
    } catch (err) {
        console.error(`Greška prilikom brisanja podataka za gosta ${guestId}:`, err);
    }
}

// Učitaj sve goste
async function loadAllGuests() {
    try {
        const allGuests = await storage.getAll(); // Učitavanje svih vrednosti
        return allGuests;
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
