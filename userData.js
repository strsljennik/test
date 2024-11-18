const fs = require('fs');
const path = './users.json';

// Set za praćenje dodeljenih brojeva
const assignedNumbers = new Set();

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

// Generiši jedinstven broj
function generateUniqueNumber() {
    let number;
    do {
        number = Math.floor(Math.random() * 8889) + 1111;
    } while (assignedNumbers.has(number));
    assignedNumbers.add(number);
    return number;
}

// Sačuvaj novog korisnika
const addNewUser = (id) => {
    const users = loadUserData();  // Učitaj korisnike sa diska
    const username = `guest-${id}`;  // Dodeljujemo ime 'guest-ID' ako je novi korisnik

    // Proveri da li već postoji korisnik sa tim ID-om
    if (!users.some(user => user.id === id)) {
        const color = getColorById(id);  // Dodeli boju na osnovu ID-a
        const newUser = { username, id, color };
        users.push(newUser);
        saveUserData(users);  // Upisuj nove podatke u fajl
        console.log(`Korisnik ${username} sa ID-om ${id} sačuvan u fajlu.`);
    } else {
        console.log(`Korisnik ${username} već postoji.`);
    }
};

// Korišćenje funkcije za dodavanje i učitavanje korisnika
const handleUserJoin = () => {
    const uniqueNumber = generateUniqueNumber();  // Generišemo jedinstveni broj
    console.log(`Generisani broj: guest-${uniqueNumber}`);
    addNewUser(uniqueNumber);  // Dodajemo korisnika sa tim brojem
};

// Test primer generisanja i dodavanja korisnika
handleUserJoin();  // Novi korisnik sa jedinstvenim brojem
handleUserJoin();  // Novi korisnik sa jedinstvenim brojem
handleUserJoin();  // Novi korisnik sa jedinstvenim brojem

module.exports = { loadUserData, saveUserData, getColorById, handleUserJoin };
