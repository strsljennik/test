const fs = require('fs');
const path = './users.json';  // Putanja do JSON fajla

// Funkcija za dodelu boje na osnovu ID-a (ili broja)
const getColorById = (id) => {
    const colorIndex = parseInt(id) % 6; // Direktno koristi broj ID-a
    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
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
const handleUserJoin = (id) => {
    console.log(`Korisnik sa ID-om ${id} ulazi.`);
    addNewUser(id);  // Dodajemo korisnika sa tim brojem
};

// Testiranje
handleUserJoin('7758'); // Testiraj sa ID-om kao broj
