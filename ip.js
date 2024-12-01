// ip.js
const fs = require('fs');
const path = require('path');

// Putanja do fajla gde će se čuvati podaci
const filePath = path.join(__dirname, 'ip-data.json');

// Funkcija za dodavanje podataka u fajl
function saveIpData(ip, message, nickname) {
    // Pronađi postojeće podatke u fajlu (ako ih ima)
    let data = [];
    if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        data = JSON.parse(fileContent);
    }

    // Dodaj novi objekat sa IP adresom, porukom i nadimkom
    const newData = {
        ip,
        message,
        nickname,
        time: new Date().toLocaleString(),
    };

    // Dodaj novi podatak u niz
    data.push(newData);

    // Spremi podatke nazad u fajl
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Funkcija za dohvat svih podataka iz fajla
function getIpData() {
    if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(fileContent);
    }
    return [];
}

module.exports = { saveIpData, getIpData };
