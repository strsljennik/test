const fs = require('fs');
const path = './users.json';

// Funkcija za dodelu boje na osnovu ID-a (ili broja)
const getColorById = (id) => {
    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
    const colorIndex = parseInt(id.split('-')[1]) % colors.length;
    return colors[colorIndex];
};

// Učitaj podatke iz users.json fajla
const loadUserData = () => {
    try {
        if (fs.existsSync(path)) {
            const data = fs.readFileSync(path, 'utf-8');
            console.log("Podaci učitani sa fajla:", data);  // Logujemo učitane podatke
            return JSON.parse(data);
        } else {
            console.log("Fajl ne postoji, vraćamo prazan niz.");
            return [];  // Ako fajl ne postoji, vraćamo prazan niz
        }
    } catch (err) {
        console.error("Greška pri učitavanju podataka:", err);
        return [];  // Ako dođe do greške, vraćamo prazan niz
    }
};

// Sačuvaj podatke u users.json
const saveUserData = (users) => {
    try {
        fs.writeFileSync(path, JSON.stringify(users, null, 2));  // Upisuj u fajl
        console.log("Podaci uspešno sačuvani u fajl.");
    } catch (err) {
        console.error("Greška pri upisu u fajl:", err);
    }
};

// Sačuvaj novog korisnika
const addNewUser = (username, id) => {
    const users = loadUserData();  // Učitaj korisnike sa diska

    // Proveri da li već postoji korisnik sa istim username-om (ID)
    if (!users.some(user => user.username === username)) {
        const color = getColorById(id);  // Dodeli boju na osnovu ID-a
        const newUser = { username, id, color };
        users.push(newUser);
        saveUserData(users);  // Upisuj nove podatke u fajl
        console.log(`Korisnik ${username} sa ID-om ${id} sačuvan u fajlu.`);
    } else {
        console.log(`Korisnik ${username} već postoji, neće biti dupliran.`);
    }
};

// Ažuriraj boju korisnika
const updateUserColor = (username, newColor) => {
    const users = loadUserData();
    const userIndex = users.findIndex(user => user.username === username);
    if (userIndex !== -1) {
        users[userIndex].color = newColor;
        saveUserData(users);  // Upisuj promenjenu boju
        console.log(`Boja korisnika ${username} ažurirana na ${newColor}.`);
    } else {
        console.log(`Korisnik ${username} nije pronađen za ažuriranje boje.`);
    }
};

// Pronađi korisnika po ID-u
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
        addNewUser(username, id);
        console.log(`Korisnik sa ID-om ${id} ulazi kao ${username} sa bojom ${getColorById(id)}`);
    }
};

// Primer upisa korisnika i učitavanja pri ulasku
handleUserJoin('guest-5555');  // Ovo će sačuvati korisnika sa ID 'guest-5555'
handleUserJoin('guest-5555');  // Ovo će učitati prethodni podaci za korisnika
handleUserJoin('guest-7777');  // Novi korisnik, biće dodeljen nik 'gost-7777'

module.exports = { loadUserData, saveUserData, updateUserColor, getUserById };
