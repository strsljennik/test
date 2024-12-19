const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios'); // Dodaj axios
const router = express.Router();

// Definisanje modela za goste
const guestSchema = new mongoose.Schema({
    uuid: { type: String, required: true, unique: true },
    nickname: { type: String, required: true },
    ipAddress: { type: String, required: true },
    timeIn: { type: Date, default: Date.now },
    timeOut: { type: Date, default: null },
    location: { type: String, default: 'Unknown' } // Dodaj polje za lokaciju
});

const Guest = mongoose.model('Guest', guestSchema);

// Funkcija za dobijanje geolokacije na osnovu hosta
const getGeoLocation = async (host) => {
    try {
        const response = await axios.get(`https://tools.keycdn.com/geo.json?host=${host}`, {
            headers: {
                'User-Agent': 'keycdn-tools:https://www.example.com',
            },
        });
        return response.data.data.geo.city || 'Unknown'; // Vraća grad ili 'Unknown'
    } catch (error) {
        console.error('Greška pri dobijanju geolokacije:', error);
        return 'Unknown';
    }
};

// POST ruta za čuvanje podataka gostiju
router.post('/', async (req, res) => {
    const { nickname, uuid } = req.body;

    // Validacija podataka
    if (!nickname || !uuid) {
        return res.status(400).json({ error: 'Nedostaju podaci' });
    }

    // Dobijanje IP adrese
    const ipAddress = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket?.remoteAddress;

    console.log('IP adresa korisnika:', ipAddress);

    try {
        // Dobijanje geolokacije na osnovu IP adrese
        const location = await getGeoLocation(ipAddress);

        // Provera da li postoji gost sa istim UUID-om
        const existingGuest = await Guest.findOne({ uuid });

        if (existingGuest) {
            // Ako postoji, ažuriraj podatke
            existingGuest.nickname = nickname;
            existingGuest.ipAddress = ipAddress;
            existingGuest.timeIn = Date.now(); // Ažuriraj vreme kada je gost ponovo pristupio
            existingGuest.location = location; // Ažuriraj geolokaciju

            await existingGuest.save();
            console.log('Podaci uspešno ažurirani u MongoDB:', `UUID: ${uuid}, Nickname: ${nickname}, IP: ${ipAddress}, Location: ${location}`);
            return res.status(200).send('Podaci ažurirani');
        }

        // Ako ne postoji, sačuvaj novog gosta
        const guest = new Guest({ uuid, nickname, ipAddress, location });
        await guest.save();

        console.log('Podaci uspešno sačuvani u MongoDB:', `UUID: ${uuid}, Nickname: ${nickname}, IP: ${ipAddress}, Location: ${location}`);

        res.status(200).send('Podaci primljeni i sačuvani');
    } catch (err) {
        console.error('Greška pri čuvanju podataka:', err);
        res.status(500).json({ error: 'Greška pri čuvanju podataka' });
    }
});

// GET ruta za dobijanje podataka po UUID-u
router.get('/:uuid', async (req, res) => {
    const { uuid } = req.params;

    try {
        // Dohvatanje podataka iz MongoDB
        const guest = await Guest.findOne({ uuid });

        if (!guest) {
            return res.status(404).json({ error: 'Podaci za dati UUID nisu pronađeni' });
        }

        res.status(200).json(guest);
    } catch (err) {
        console.error('Greška pri dohvatanju podataka:', err);
        res.status(500).json({ error: 'Greška pri dohvatanju podataka' });
    }
});

module.exports = router;
