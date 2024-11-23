const storage = require('node-persist');
const path = require('path');
const fs = require('fs');
const requestIp = require('request-ip'); // Za dobijanje javne IP adrese
const useragent = require('user-agent'); // Za analizu podataka o korisniku

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
        await initializeStorage();

        // Generiši ključ i prikupljaj podatke
        const key = username || `gost-${Math.floor(1111 + Math.random() * 8888)}`;
        const ip = requestIp.getClientIp(req) || 'Nepoznata IP';
        const agent = useragent.parse(req.headers['user-agent']);
        
        // Objekat sa podacima o gostu
        const guestData = {
            ip: ip,
            browser: agent.browser.name,
            device: agent.device.type || 'Nepoznato',
            os: agent.os.name,
            timestamp: new Date().toISOString()
        };

        // Čuvanje podataka
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

// Funkcija za testiranje
async function testServer(req) {
    await saveGuestData(req, 'gost-1234');
    await loadAllGuests();
}

// Primer upotrebe (zahteva HTTP server za prosleđivanje `req` objekta)
// testServer(req);
