const storage = require('node-persist');
const path = require('path');
const fs = require('fs');
const requestIp = require('request-ip'); // Za dobijanje IP adrese
const geoip = require('geoip-lite'); // Za geolokaciju na osnovu IP adrese

// Putanja do direktorijuma u kojem će biti sačuvani podaci
const storageDir = path.join(__dirname, 'cuvati');

// Automatska inicijalizacija skladišta
async function initializeStorage() {
    try {
        if (!fs.existsSync(storageDir)) {
            console.log('[INFO] Kreiramo direktorijum "cuvati"...');
            fs.mkdirSync(storageDir, { recursive: true });
        }

        await storage.init({
            dir: storageDir,
            forgiveParseErrors: true,
            ttl: false,
            encrypt: false,
            raw: true,
        });
        console.log('[INFO] Skladište je uspešno inicijalizovano.');
    } catch (error) {
        console.error('[ERROR] Greška pri inicijalizaciji skladišta:', error);
    }
}

// Funkcija za dodavanje podataka o gostu
async function saveGuestData(req, username) {
    try {
        // Generiši ključ i prikupljaj podatke
        const key = username || `gost-${Math.floor(1111 + Math.random() * 8888)}`;
        const ip = requestIp.getClientIp(req) || 'Nepoznata IP';

        // Pribavljanje geolokacije
        const geo = geoip.lookup(ip) || {}; // Ako geoip nije pronašao, vraća prazan objekat

        // Formiraj podatke o korisniku
        const guestData = {
            ip: ip,
            city: geo.city || 'Nepoznat grad',  // Ako nije prepoznat grad, stavi "Nepoznat grad"
            country: geo.country || 'Nepoznata država', // Ako nije prepoznata država, stavi "Nepoznata država"
            timestamp: new Date().toISOString(),
        };

        // Čuvanje podataka u skladištu
        console.log(`[INFO] Sačuvaj podatke za gosta ${key}:`, guestData);
        await storage.setItem(key, guestData);
    } catch (err) {
        console.error('[ERROR] Greška prilikom čuvanja podataka o gostu:', err);
    }
}

// Funkcija za učitavanje svih gostiju
async function loadAllGuests() {
    try {
        const keys = await storage.keys();
        if (keys.length === 0) {
            console.log('[INFO] Nema gostiju. Dodajte goste!');
            return;
        }

        console.log(`[INFO] Nađeno ${keys.length} gostiju:`, keys);
        for (const key of keys) {
            const guestData = await storage.getItem(key);
            console.log(`${key}: ${JSON.stringify(guestData)}`);
        }
    } catch (err) {
        console.error('[ERROR] Greška prilikom učitavanja gostiju:', err);
    }
}

module.exports = { initializeStorage, saveGuestData, loadAllGuests };
