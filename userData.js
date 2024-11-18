const fs = require('fs');
const path = './users.json';

// Funkcija za dodelu boje na osnovu ID-a (ili broja)
const getColorById = (id) => {
    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
    // Dodeljujemo boju na osnovu broja (koristi jednostavan hash funkciju)
    const colorIndex = parseInt(id.split('-')[1]) % colors.length;
    return colors[colorIndex];
};

// Učitaj podatke iz users.json fajla
const loadUserData = () => {
    try {
        return JSON.parse(fs.readFileSync(path, 'utf-8'));
    } catch (err) {
        return [];  // Ako fajl ne postoji, vrati prazan niz
    }
};

// Sačuvaj podatke u users.json
const saveUserData = (username, id) => {
    const users = loadUserData();

    // Proveri da li već postoji korisnik sa istim username-om (ID)
    if (!users.some(user => user.username === username)) {
        const color = getColorById(id);  // Dodeli boju na osnovu ID-a
        users.push({ username, id, color });
        fs.writeFileSync(path, JSON.stringify(users, null, 2));  // Upisuj u fajl
    }
};

// Ažuriraj boju korisnika
const updateUserColor = (username, newColor) => {
    const users = loadUserData();
    const userIndex = users.findIndex(user => user.username === username);
    if (userIndex !== -1) {
        users[userIndex].color = newColor;
        fs.writeFileSync(path, JSON.stringify(users, null, 2));  // Upisuj promenjenu boju
    }
};

// Pronađi korisnika po username-u
const getUserById = (id) => {
    const users = loadUserData();
    return users.find(user => user.id === id);  // Vrati korisnika sa datim ID-om
};

// Korišćenje funkcija za dodavanje i učitavanje korisnika
const handleUserJoin = (id) => {
    const user = getUserById(id);

    if (user) {
        console.log(`Korisnik sa ID-om ${id} vraća se sa nikom ${user.username} i bojom ${user.color}`);
    } else {
        const username = `gost-${id}`;  // Dodeljujemo ime 'gost-ID' ako je novi korisnik
        saveUserData(username, id);
        console.log(`Korisnik sa ID-om ${id} ulazi kao ${username} sa bojom ${getColorById(id)}`);
    }
};

// Primer upisa korisnika i učitavanja pri ulasku
handleUserJoin('guest-5555');  // Ovo će sačuvati korisnika sa ID 'guest-5555'
handleUserJoin('guest-5555');  // Ovo će učitati prethodni podaci za korisnika
handleUserJoin('guest-7777');  // Novi korisnik, biće dodeljen nik 'gost-7777'

module.exports = { loadUserData, saveUserData, updateUserColor, getUserById };
