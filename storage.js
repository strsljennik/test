const storage = require('node-persist');

// Inicijalizacija storage-a sa prilagođenim direktorijumom (opciono)
async function initializeStorage() {
    try {
        await storage.init({
            dir: './data', // Folder gde će se podaci čuvati
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
        const allGuests = await storage.values(); // Učitavanje svih vrednosti
        return allGuests;
    } catch (err) {
        console.error('Greška prilikom učitavanja svih gostiju:', err);
    }
}

// Inicijalizacija storage-a pri pokretanju
initializeStorage();

// storage.js
export { saveGuestData, loadGuestData, deleteGuestData, loadAllGuests };

