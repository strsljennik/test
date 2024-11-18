const storage = require('node-persist');

// Asinhrona inicijalizacija storage-a sa async/await
async function initializeStorage() {
    try {
        await storage.init();
    } catch (err) {
        console.error('Greška prilikom inicijalizacije storage-a:', err);
    }
}

// Čuvanje podataka gosta
function saveGuestData(guestId, nickname, color = 'default') {
    const guestData = {
        nickname: nickname,
        color: color,
    };
    storage.setItem(guestId, guestData);
}

// Učitavanje podataka gosta
function loadGuestData(guestId) {
    return storage.getItem(guestId);
}

// Brisanje podataka gosta
function deleteGuestData(guestId) {
    storage.removeItem(guestId);
}

// Učitavanje svih podataka o gostima
function loadAllGuests() {
    return storage.values();
}

// Inicijalizacija storage-a
initializeStorage();

// Izvoz funkcija
module.exports = { saveGuestData, loadGuestData, deleteGuestData, loadAllGuests };
