const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Objekat za privremeno skladištenje podataka (možeš koristiti bazu umesto ovoga)
const guestData = {};

// POST ruta za čuvanje podataka gostiju
router.post('/', (req, res) => {
    const { nickname, uuid } = req.body;

    // Validacija podataka
    if (!nickname || !uuid) {
        return res.status(400).json({ error: 'Nedostaju podaci' });
    }

    // Dobijanje IP adrese
    const ipAddress = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket?.remoteAddress;

// Logovanje IP adrese
console.log('X-Forwarded-For:', req.headers['x-forwarded-for']);  // Logujemo sadržaj zaglavlja
console.log('IP adresa korisnika:', ipAddress);  // Logujemo IP koju smo dobili

    // Čuvanje podataka sa `uuid` kao ključem
    guestData[uuid] = { nickname, ipAddress };

    console.log('Podaci uspešno primljeni i sačuvani:');
    console.log(`UUID: ${uuid}, Nickname: ${nickname}, IP: ${ipAddress}`);

    // Logovanje u fajl
    const logEntry = `UUID: ${uuid}, Nickname: ${nickname}, IP: ${ipAddress}\n`;
    const logPath = path.join(__dirname, 'evidencija.txt');

    // Kreiranje fajla ako ne postoji i zapisivanje podataka
    fs.mkdir(path.dirname(logPath), { recursive: true }, (err) => {
        if (err) {
            console.error('Greška pri kreiranju direktorijuma:', err);
            return res.status(500).json({ error: 'Greška pri kreiranju direktorijuma' });
        }

        fs.appendFile(logPath, logEntry, (err) => {
            if (err) {
                console.error('Greška pri zapisivanju u fajl:', err);
                return res.status(500).json({ error: 'Greška pri zapisivanju podataka' });
            }
            res.status(200).send('Podaci primljeni i zapisani');
        });
    });
});

// GET ruta za dobijanje podataka po UUID-u
router.get('/:uuid', (req, res) => {
    const { uuid } = req.params;

    // Provera da li podaci postoje
    if (!guestData[uuid]) {
        return res.status(404).json({ error: 'Podaci za dati UUID nisu pronađeni' });
    }

    res.status(200).json(guestData[uuid]);
});

module.exports = router;
