const fs = require('fs');

// Putanja do JSON fajla
const filePath = './korisnici.json';

// Funkcija za učitavanje podataka iz JSON fajla
function loadGuests() {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return {}; // Ako fajl ne postoji, vrati prazan objekat
    }
}

// Funkcija za upisivanje podataka u JSON fajl
function saveGuests(guests) {
    fs.writeFileSync(filePath, JSON.stringify(guests, null, 2));
}

// Funkcija za dodavanje korisnika (gosta) u fajl
function addGuest(nick, color, number) {
    const guests = loadGuests();
    
    // Dodaj novog gosta
    guests[nick] = { color, number };

    // Spasi promene u fajl
    saveGuests(guests);
}

// Funkcija za dobijanje podataka o svim korisnicima
function getGuests() {
    return loadGuests();
}

// Izvoz svih funkcija kao API za korišćenje u drugim delovima aplikacije
module.exports = {
    addGuest,
    getGuests
};
