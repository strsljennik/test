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

// Sačuvaj podatke u users.json
const saveUserData = (username, id) => {
    const users = loadUserData();
    
    // Proveri da li već postoji korisnik sa istim ID-om, pa ga ne dodaj ponovo
    if (!users.some(user => user.id === id)) {
        users.push({ username, id });
        fs.writeFileSync(path, JSON.stringify(users, null, 2));  // Upisuj u fajl
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
        console.log(`Korisnik sa ID-om ${id} vraća se sa nikom ${user.username}`);
    } else {
        // Ako je korisnik nov, dodeli mu novi ID i ime
        const username = `gost-${id}`;  // Primer kako možeš dodeliti naziv za gosta
        saveUserData(username, id);
        console.log(`Korisnik sa ID-om ${id} ulazi kao ${username}`);
    }
};

// Primer upisa korisnika i učitavanja pri ulasku
handleUserJoin('guest-5555');  // Ovo će sačuvati korisnika sa ID 'guest-5555'

// Ovo simulira da server ponovo pokreće i učitava korisnike
handleUserJoin('guest-5555');  // Ovo će učitati prethodni podaci za korisnika
handleUserJoin('guest-7777');  // Novi korisnik, biće dodeljen nik 'gost-7777'
