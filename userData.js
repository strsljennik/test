const fs = require('fs');
const path = './users.json';

// Učitaj podatke iz users.json fajla
const loadUserData = () => {
    try {
        return JSON.parse(fs.readFileSync(path, 'utf-8'));
    } catch (err) {
        return [];  // Ako fajl ne postoji, vrati prazan niz
    }
};

// Sačuvaj nove podatke u users.json
const saveUserData = (username, color) => {
    const users = loadUserData();
    users.push({ username, color });
    fs.writeFileSync(path, JSON.stringify(users, null, 2));
};

// Ažuriraj boju korisnika
const updateUserColor = (username, newColor) => {
    const users = loadUserData();
    const userIndex = users.findIndex(u => u.username === username);
    if (userIndex !== -1) {
        users[userIndex].color = newColor;
        fs.writeFileSync(path, JSON.stringify(users, null, 2));
    }
};

module.exports = { loadUserData, saveUserData, updateUserColor };
