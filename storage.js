const storage = require('node-persist');
const path = require('path');
const fs = require('fs');

let isStorageInitialized = false;

// Automatska inicijalizacija skladišta
async function initializeStorage() {
    if (isStorageInitialized) return; // Ako je već inicijalizovano, ne ponavljaj.

    const storageDir = path.join(__dirname, 'cuvati');

    // Provera da li direktorijum postoji, ako ne kreiramo ga.
    if (!fs.existsSync(storageDir)) {
        console.log('Direktorijum "cuvati" ne postoji. Kreiramo ga...');
        fs.mkdirSync(storageDir, { recursive: true });
    }

    try {
        await storage.init({
            dir: storageDir,
            forgiveParseErrors: true, // Ignoriši greške pri parsiranju
        });
        isStorageInitialized = true; // Postavi skladište kao inicijalizovano
        console.log('Skladište je uspešno inicijalizovano.');
    } catch (error) {
        console.error('Greška pri inicijalizaciji skladišta:', error);
    }
}

// Funkcija za čuvanje podataka gosta
async function saveGuestData(nickname = null, color = null) {
    try {
        await initializeStorage(); // Osiguraj da je skladište inicijalizovano.

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
            const newGuestData = { color: color || 'default' }; // Default boja ako nije prosleđena
            existingData = newGuestData; // Dodajte podatke za novog gosta u promenljivu
            console.log(`Kreiran novi gost: ${nickname}`, newGuestData);
        }

        // Sačuvaj ažurirane podatke
        await storage.setItem(nickname, existingData);
        console.log(`Podaci za gosta ${nickname} su ažurirani:`, existingData);
    } catch (err) {
        console.error(`Greška prilikom čuvanja podataka za gosta ${nickname}:`, err);
    }
}

// Funkcija za prikaz svih gostiju
async function displayAllGuests() {
    try {
        await initializeStorage(); // Osiguraj da je skladište inicijalizovano.
        const keys = await storage.keys(); // Dohvati sve ključeve (gost-1234, gost-5678, itd.)

        if (keys.length === 0) {
            console.log('Nema gostiju. Dodajte goste!');
            return;
        }

        console.log('Svi gosti:');
        // Korišćenje Promise.all da paralelno dohvati sve goste
        const guestPromises = keys.map(async key => {
            const guestData = await storage.getItem(key);
            console.log(`${key}:`, guestData);
        });

        // Čekaj da svi gosti budu dohvaceni
        await Promise.all(guestPromises);
    } catch (err) {
        console.error('Greška prilikom prikaza svih gostiju:', err);
    }
}

// Testiranje servera
async function testServer() {
    console.log('=== Testiranje servera ===');
    await saveGuestData(null, 'blue'); // Automatski nickname, boja "blue"
    await saveGuestData('gost-1234', 'green'); // Ručno dodavanje
    await saveGuestData('gost-1234', 'yellow'); // Ažuriranje boje
    await displayAllGuests(); // Prikaz svih gostiju
}

// Pokreni test i server
async function startServer() {
    try {
        await initializeStorage(); // Inicijalizujte skladište
        console.log('Server je spreman!');
        await testServer(); // Testiranje nakon inicijalizacije
    } catch (err) {
        console.error('Greška pri pokretanju servera:', err);
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

