const storage = require('node-persist');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); // Za generisanje UUID

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
            dir: storageDir, // koristi lokalni direktorijum 'cuvati'
            forgiveParseErrors: true, // ignoriši greške prilikom parsiranja podataka
            ttl: false, // isključuje automatsko podešavanje vremena isteka podataka
            encrypt: false, // isključuje šifrovanje, podatke čuva u plain text formatu
            raw: true, // onemogućava heširanje ključeva
        });
        console.log('[INFO] Skladište je uspešno inicijalizovano.');
        console.log(`[INFO] Skladište se nalazi u direktorijumu: ${storageDir}`);
    } catch (error) {
        console.error('[ERROR] Greška pri inicijalizaciji skladišta:', error);
    }
}

// Funkcija za generisanje nasumičnog broja za ime gosta
function generateGuestNickname() {
    const randomNumber = Math.floor(Math.random() * (9999 - 1111 + 1)) + 1111; // Nasumičan broj između 1111 i 9999
    return `Gost-${randomNumber}`;
}

// Funkcija za dodavanje ili ažuriranje podataka o gostu
async function saveGuestData(uuid, username, color) {
    try {
        await initializeStorage();

        }

        // Kreiraj objekat s novim vrednostima
        const guestData = {
            nik: username,
            color: color || 'default',  // Ako boja nije prosleđena, koristi 'default'
        };

        // Logovanje podataka pre nego što ih sačuvamo
        console.log(`[INFO] Sačuvaj podatke za gosta ${username} (key: ${uuid}):`, guestData);

        // Prvo obriši stare podatke pre nego što sačuvaš nove
        await storage.removeItem(uuid);

        // Sačuvaj ažurirane podatke pod UUID-jem
        await storage.setItem(uuid, guestData);
        console.log(`[INFO] Podaci za gosta ${username} sa ključem "${uuid}" su sačuvani:`, guestData);
    } catch (err) {
        console.error(`[ERROR] Greška prilikom čuvanja podataka za gosta ${username}:`, err);
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

        const guestPromises = keys.map(async (key) => {
            const guestData = await storage.getItem(key);

            // Ako podaci nisu pronađeni, postavi ih na prazan string
            if (!guestData) {
                console.warn(`[WARN] Podaci za gosta ${key} nisu pronađeni ili su nevalidni.`);
                return `${key}: Nema podataka`; // Vraćamo string ako nema podataka
            }

            // Vraćamo podatke kao string
            return `${key}: ${JSON.stringify(guestData)}`;
        });

        // Obrađujemo sve goste i logujemo ih
        const guestDataStrings = await Promise.all(guestPromises);
        guestDataStrings.forEach(data => console.log(data));

    } catch (err) {
        console.error('[ERROR] Greška prilikom učitavanja svih gostiju:', err);
    }
}

// Funkcija za učitavanje specifičnog gosta
async function loadGuestDataByKey(uuid) {
    try {
        const guestData = await storage.getItem(uuid);
        if (guestData) {
            console.log('[INFO] Podaci za gosta:', guestData);
        } else {
            console.log(`[INFO] Nema podataka za gosta sa UUID-om: ${uuid}`);
        }
    } catch (err) {
        console.error(`[ERROR] Greška prilikom učitavanja podataka za gosta sa UUID-om: ${uuid}`, err);
    }
}

// Funkcija koja čisti sve podatke na svakih 1 minut
setInterval(async () => {
    const keys = await storage.keys();
    if (keys.length > 0) {
        console.log('[INFO] Brisanje starih podataka...');
        for (const key of keys) {
            await storage.removeItem(key);  // Brišemo podatke za svakog gosta
            console.log(`[INFO] Obrisani podaci za gosta sa UUID-om: ${key}`);
        }
    }
    console.log('[INFO] Ažurirani podaci o gostima.');
}, 60 * 1000);  // 60 * 1000 ms = 1 minut

// Testiranje servera
async function testServer() {
    const uuid1 = uuidv4(); // Generisanje UUID za prvog gosta
    const uuid2 = uuidv4(); // Generisanje UUID za drugog gosta

    const guestNickname1 = generateGuestNickname(); // Generisanje imena gosta
    const guestNickname2 = generateGuestNickname(); // Generisanje imena gosta

    await saveGuestData(uuid1, guestNickname1, 'plava');
    await saveGuestData(uuid2, guestNickname2, 'crvena');
    await loadAllGuests();
}

// Pokreni server
async function startServer() {
    await initializeStorage();  // Inicijalizuj storage pre nego što nastavimo sa serverom
    console.log('[INFO] Server je spreman!');
    await loadAllGuests();  // Učitaj sve goste na početku
}

// Pokreni server
startServer();

// Izvoz funkcija za dodatnu upotrebu
module.exports = {
    saveGuestData,
    loadAllGuests,
    initializeStorage,
};
