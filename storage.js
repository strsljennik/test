const storage = require('node-persist');

// Inicijalizacija storage-a
storage.initSync();

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

module.exports = { saveGuestData, loadGuestData, deleteGuestData, loadAllGuests };
