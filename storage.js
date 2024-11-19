const storage = require('node-persist');
const path = require('path');
const fs = require('fs');

// Putanja do direktorijuma u kojem će biti sačuvani podaci
const storageDir = path.join(__dirname, 'cuvati');

// Automatska inicijalizacija skladišta
async function initializeStorage() {
    try {
        // Ako direktorijum ne postoji, kreiraj ga
        if (!fs.existsSync(storageDir)) {
            console.log('[INFO] Direktorijum "cuvati" ne postoji. Kreiramo ga...');
            fs.mkdirSync(storageDir, { recursive: true });
        }

        // Inicijalizacija skladišta sa direktorijumom
        await storage.init({
            dir: storageDir,
            forgiveParseErrors: true,
        });
        console.log('[INFO] Skladište je uspešno inicijalizovano.');
    } catch (error) {
        console.error('[ERROR] Greška pri inicijalizaciji skladišta:', error);
    }
}

// Funkcija za čuvanje podataka gosta
async function saveGuestData(nickname = null, color = null) {
    try {
        await initializeStorage();

        // Generiši `nickname` ako nije prosleđen
        if (!nickname) {
            nickname = `gost-${Math.floor(1000 + Math.random() * 9000)}`;
        }

        // Dohvati postojeće podatke za ovog gosta
        let existingData = await storage.getItem(nickname);

        if (existingData) {
            // Ažuriraj `color` ako je prosleđen novi
            if (color) {
                existingData.color = color;
            }
        } else {
            // Kreiraj novi unos za gosta
            const newGuestData = { color: color || 'default' };
            existingData = newGuestData; 
            console.log(`[INFO] Kreiran novi gost: ${nickname}`, newGuestData);
        }

        // Sačuvaj ažurirane podatke
        await storage.setItem(nickname, existingData);
        console.log(`[INFO] Podaci za gosta ${nickname} su ažurirani:`, existingData);
    } catch (err) {
        console.error(`[ERROR] Greška prilikom čuvanja podataka za gosta ${nickname}:`, err);
    }
}

// Funkcija za prikaz svih gostiju
async function displayAllGuests() {
    try {
        await initializeStorage();
        const keys = await storage.keys();

        if (keys.length === 0) {
            console.log('[INFO] Nema gostiju. Dodajte goste!');
            return;
        }

        console.log('[INFO] Svi gosti:');
        const guestPromises = keys.map(async key => {
            const guestData = await storage.getItem(key);
            console.log(`${key}:`, guestData);
        });

        await Promise.all(guestPromises);
    } catch (err) {
        console.error('[ERROR] Greška prilikom prikaza svih gostiju:', err);
    }
}

// Testiranje servera
async function testServer() {
    try {
        console.log('=== Testiranje servera ===');
        await saveGuestData(null, 'blue'); // Automatski nickname, boja "blue"
        await saveGuestData('gost-1234', 'green'); // Ručno dodavanje
        await saveGuestData('gost-1234', 'yellow'); // Ažuriranje boje
        await displayAllGuests(); // Prikaz svih gostiju
    } catch (error) {
        console.error('[ERROR] Greška prilikom testiranja servera:', error);
    }
}

// Pokreni test i server
async function startServer() {
    try {
        await initializeStorage();
        console.log('[INFO] Server je spreman!');
        await testServer();
    } catch (err) {
        console.error('[ERROR] Greška pri pokretanju servera:', err);
    }
}

// Pokreni server
startServer();

// Izvoz funkcija za dodatnu upotrebu
module.exports = {
    saveGuestData,
    displayAllGuests,
    initializeStorage,
};
