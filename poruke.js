const fs = require('fs');  // Uvozimo fs za rad sa fajlovima

// Putanja do JSON fajla gde ćemo čuvati podatke
const dataFile = './userSettings.json';

// Funkcija za čitanje podataka iz JSON fajla
function readDataFromFile() {
    try {
        const data = fs.readFileSync(dataFile, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.log("Nema podataka, vraćeno je prazno {}");
        return {};  // Ako nema podataka, vraća prazan objekat
    }
}

// Funkcija za upisivanje podataka u JSON fajl
function writeDataToFile(data) {
    try {
        fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf8');
        console.log("Podaci su sačuvani u fajl.");
    } catch (err) {
        console.error("Greška prilikom upisa u fajl:", err);
    }
}

module.exports = { readDataFromFile, writeDataToFile }; // Izvozimo funkcije
