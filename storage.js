const storage = require('node-persist');
const path = require('path');
const fs = require('fs');

let isStorageInitialized = false;

// Funkcija za generisanje podrazumevanog `nickname`
function generateDefaultNickname() {
    return `gost-${Math.floor(1000 + Math.random() * 9000)}`; // Format: gost-<broj>
}

// Inicijalizacija skladišta
async function initializeStorage() {
    if (isStorageInitialized) return;

    const storageDir = path.join(__dirname, 'cuvati');

    // Automatski kreiraj direktorijum ako ne postoji
    if (!fs.existsSync(storageDir)) {
        fs.mkdirSync(storageDir, { recursive: true });
    }

    try {
        await storage.init({
            dir: storageDir,
            forgiveParseErrors: true // Ignoriši greške pri parsiranju
        });
        isStorageInitialized = true;
        console.log('Skladište je uspešno inicijalizovano.');
    } catch (error) {
        console.error('Greška pri inicijalizaciji skladišta:', error);
    }
}

// Sačuvaj podatke gosta
async function saveGuestData(nickname = null, color = null) {
    try {
        await initializeStorage();

        // Generiši `nickname` ako nije prosleđen
        if (!nickname) {
            nickname = generateDefaultNickname();
        }

        // Dohvati postojeće podatke za ovog gosta
        const existingData = await storage.getItem(nickname);

        if (existingData) {
            // Ažuriraj `color` ako je prosleđen novi
            if (color) {
                existingData.color = color;
            }
        } else {
            // Kreiraj novi unos za gosta
            const newGuestData = { color: color || 'default' };
            await storage.setItem(nickname, newGuestData);
            console.log(`Kreiran novi gost: ${nickname}`, newGuestData);
            return;
        }

        // Sačuvaj ažurirane podatke
        await storage.setItem(nickname, existingData);
        console.log(`Podaci za gosta ${nickname} su ažurirani:`, existingData);
    } catch (err) {
        console.error(`Greška prilikom čuvanja podataka za gosta ${nickname}:`, err);
    }
}

// Učitaj podatke za jednog gosta
async function getGuestData(nickname) {
    try {
        await initializeStorage();
        const guestData = await storage.getItem(nickname);
        if (guestData) {
            console.log(`Podaci za gosta ${nickname}:`, guestData);
        } else {
            console.log(`Gost ${nickname} ne postoji.`);
        }
        return guestData;
    } catch (err) {
        console.error(`Greška prilikom učitavanja podataka za gosta ${nickname}:`, err);
        return null;
    }
}

// Prikaz svih gostiju
async function displayAllGuests() {
    try {
        await initializeStorage();
        const keys = await storage.keys();
        if (keys.length === 0) {
            console.log('Nema gostiju. Dodajte goste!');
            return;
        }
        for (const key of keys) {
            const guestData = await storage.getItem(key);
            console.log(`${key}:`, guestData);
        }
    } catch (err) {
        console.error('Greška prilikom prikaza svih gostiju:', err);
    }
}

// Testiranje - inicijalizacija, dodavanje i prikaz gostiju
initializeStorage().then(async () => {
    console.log('=== Prikaz trenutnih gostiju ===');
    await displayAllGuests();

    console.log('\n=== Dodavanje novih gostiju ===');
    await saveGuestData(null, 'red'); // Dodaje gosta sa automatskim nickname i bojom "red"
    await saveGuestData('gost-1234', 'blue'); // Dodaje gosta sa specifikovanim nickname i bojom "blue"
    await saveGuestData('gost-1234', 'green'); // Ažurira boju postojećeg gosta

    console.log('\n=== Prikaz gostiju nakon izmene ===');
    await displayAllGuests();
}).catch(err => {
    console.error('Greška pri inicijalizaciji storage-a:', err);
});

// Izvoz funkcija
module.exports = {
    saveGuestData,
    getGuestData,
    displayAllGuests,
    initializeStorage
};
