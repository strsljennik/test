const storage = require('node-persist');

// Asinhrona inicijalizacija storage-a
async function initializeStorage() {
    try {
        await storage.init(); // Inicijalizacija
        console.log('Storage je uspešno inicijalizovan.');
    } catch (err) {
        console.error('Greška prilikom inicijalizacije storage-a:', err);
    }
}

// Asinhrono čuvanje podataka gosta
async function saveGuestData(guestId, nickname, color = 'default') {
    try {
        const guestData = {
            nickname: nickname,
            color: color,
        };
        await storage.setItem(guestId, guestData); // Čuvanje u skladište
        console.log(`Podaci za gosta ${guestId} su uspešno sačuvani.`);
    } catch (err) {
        console.error(`Greška prilikom čuvanja podataka za gosta ${guestId}:`, err);
    }
}

// Asinhrono učitavanje podataka gosta
async function loadGuestData(guestId) {
    try {
        const guestData = await storage.getItem(guestId); // Učitavanje iz skladišta
        if (!guestData) {
            console.warn(`Podaci za gosta ${guestId} nisu pronađeni.`);
        }
        return guestData;
    } catch (err) {
        console.error(`Greška prilikom učitavanja podataka za gosta ${guestId}:`, err);
    }
}

// Asinhrono brisanje podataka gosta
async function deleteGuestData(guestId) {
    try {
        await storage.removeItem(guestId); // Brisanje iz skladišta
        console.log(`Podaci za gosta ${guestId} su uspešno obrisani.`);
    } catch (err) {
        console.error(`Greška prilikom brisanja podataka za gosta ${guestId}:`, err);
    }
}

// Asinhrono učitavanje svih podataka o gostima
async function loadAllGuests() {
    try {
        const allGuests = await storage.values(); // Dobavljanje svih vrednosti
        return allGuests;
    } catch (err) {
        console.error('Greška prilikom učitavanja svih gostiju:', err);
    }
}

// Inicijalizacija storage-a prilikom pokretanja
initializeStorage();

// Izvoz funkcija
module.exports = { saveGuestData, loadGuestData, deleteGuestData, loadAllGuests };
