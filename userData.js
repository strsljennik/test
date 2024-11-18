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
        const data = fs.readFileSync(path, 'utf-8');
        console.log("Loaded data from file:", data); // Dodajemo log za učitavanje podataka
        return JSON.parse(data);
    } catch (err) {
        console.error("Error loading user data:", err); // Logujemo greške prilikom učitavanja
        return [];  // Ako fajl ne postoji, vraćamo prazan niz
    }
};

// Sačuvaj podatke u users.json
const saveUserData = (username, id) => {
    const users = loadUserData();
    console.log(`Saving user ${username} with ID ${id} to file...`); // Logujemo pre upisa

    // Proveri da li već postoji korisnik sa istim username-om (ID)
    if (!users.some(user => user.username === username)) {
        const color = getColorById(id);  // Dodeljujemo boju na osnovu ID-a
        users.push({ username, id, color });
        fs.writeFileSync(path, JSON.stringify(users, null, 2));  // Upisuj u fajl
        console.log(`User ${username} saved with color ${color}`); // Logujemo da je korisnik sačuvan
    }
};

// Ažuriraj boju korisnika
const updateUserColor = (username, newColor) => {
    const users = loadUserData();
    console.log(`Updating color for user ${username} to ${newColor}`); // Logujemo promenu boje

    const userIndex = users.findIndex(user => user.username === username);
    if (userIndex !== -1) {
        users[userIndex].color = newColor;
        fs.writeFileSync(path, JSON.stringify(users, null, 2));  // Upisuj promenjenu boju
        console.log(`Color for user ${username} updated to ${newColor}`); // Logujemo uspešnu promenu
    }
};

// Pronađi korisnika po username-u
const getUserById = (id) => {
    const users = loadUserData();
    console.log(`Searching for user with ID ${id}`); // Logujemo pre traženja korisnika
    return users.find(user => user.id === id);  // Vrati korisnika sa datim ID-om
};

// Korišćenje funkcija za dodavanje i učitavanje korisnika
const handleUserJoin = (id) => {
    const user = getUserById(id);
    console.log(`Handling user join for ID ${id}`); // Logujemo pokušaj prijave korisnika

    if (user) {
        console.log(`User with ID ${id} is returning with nickname ${user.username} and color ${user.color}`);
    } else {
        const username = `gost-${id}`;  // Dodeljujemo ime 'gost-ID' ako je novi korisnik
        saveUserData(username, id);
        console.log(`User with ID ${id} joined as ${username} with color ${getColorById(id)}`);
    }
};

// Primer upisa korisnika i učitavanja pri ulasku
console.log("Simulating user joins...");
handleUserJoin('guest-5555');  // Ovo će sačuvati korisnika sa ID 'guest-5555'
handleUserJoin('guest-5555');  // Ovo će učitati prethodni podaci za korisnika
handleUserJoin('guest-7777');  // Novi korisnik, biće dodeljen nik 'gost-7777'

module.exports = { loadUserData, saveUserData, updateUserColor, getUserById };
