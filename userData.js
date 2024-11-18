const fs = require('fs');
const path = './users.json';

// Učitaj podatke iz users.json fajla
const loadUserData = () => {
    try {
        return JSON.parse(fs.readFileSync(path, 'utf-8'));
    } catch (err) {
        console.log('Fajl nije pronađen, kreiraćemo novi.');
        return [];  // Ako fajl ne postoji, vrati prazan niz
    }
};

// Sačuvaj nove podatke u users.json
const saveUserData = (username, color) => {
    const users = loadUserData();  // Učitaj postojeće podatke
    console.log('Trenutni podaci:', users);  // Prikazivanje trenutnog stanja
    users.push({ username, color });  // Dodaj novog korisnika
    console.log('Dodati korisnik:', { username, color });
    fs.writeFileSync(path, JSON.stringify(users, null, 2));  // Upisuj u fajl
};

// Ažuriraj boju korisnika
const updateUserColor = (username, newColor) => {
    const users = loadUserData();
    const userIndex = users.findIndex(u => u.username === username);
    if (userIndex !== -1) {
        users[userIndex].color = newColor;
        fs.writeFileSync(path, JSON.stringify(users, null, 2));  // Upisuj promenjenu boju
        console.log(`Boja korisnika ${username} ažurirana na ${newColor}`);
    } else {
        console.log(`Korisnik ${username} nije pronađen.`);
    }
};

module.exports = { loadUserData, saveUserData, updateUserColor };
