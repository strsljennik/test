const path = './guests.json';  // Promeni ime fajla ako je potrebno

// Funkcija za dodelu boje na osnovu ID-a (ili broja)
const getColorById = (id) => {
    const idStr = String(id);  // Osigurajmo da je ID uvek string
    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
    const colorIndex = parseInt(idStr.split('-')[1]) % colors.length;
    return colors[colorIndex];
};

// Učitaj podatke iz guests.json fajla
const loadGuestData = () => {
    try {
        if (fs.existsSync(path)) {
            const data = fs.readFileSync(path, 'utf-8');
            console.log("Podaci učitani sa fajla:", data);  // Logujemo učitane podatke
            return JSON.parse(data);
        } else {
            console.log("Fajl ne postoji, vraćamo prazan niz.");
            return [];  // Ako fajl ne postoji, vraćamo prazan niz
        }
    } catch (err) {
        console.error("Greška pri učitavanju podataka:", err);
        return [];  // Ako dođe do greške, vraćamo prazan niz
    }
};

// Sačuvaj podatke u guests.json
const saveGuestData = (guests) => {
    try {
        console.log("Spremam goste u fajl:", guests);  // Logujemo pre upisa u fajl
        fs.writeFileSync(path, JSON.stringify(guests, null, 2));  // Upisuj u fajl
        console.log("Podaci uspešno sačuvani u fajl.");
    } catch (err) {
        console.error("Greška pri upisu u fajl:", err);
    }
};

// Sačuvaj novog gosta
const addNewGuest = (id) => {
    const guests = loadGuestData();  // Učitaj goste sa diska
    const guestname = `guest-${id}`;  // Dodeljujemo ime 'guest-ID' ako je novi gost

    // Proveri da li već postoji gost sa tim ID-om
    if (!guests.some(guest => guest.id === id)) {
        const color = getColorById(id);  // Dodeli boju na osnovu ID-a
        const newGuest = { guestname, id, color };
        guests.push(newGuest);
        saveGuestData(guests);  // Upisuj nove podatke u fajl
        console.log(`Gost ${guestname} sa ID-om ${id} sačuvan u fajlu.`);
    } else {
        console.log(`Gost ${guestname} već postoji.`);
    }
};

// Korišćenje funkcije za dodavanje i učitavanje gostiju
const handleGuestJoin = (id) => {
    console.log(`Gost sa ID-om ${id} ulazi.`);
    addNewGuest(id);  // Dodajemo gosta sa tim brojem
};

module.exports = { loadGuestData, saveGuestData, getColorById, handleGuestJoin };
