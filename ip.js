let connectedIps = []; // Ovdje čuvamo sve povezane IP adrese
let messages = []; // Ovdje čuvamo poruke sa pripadajućim IP adresama

module.exports = (app) => {
    // Omogućavamo da Express prepozna stvarnu IP adresu iza proxy servera
    app.set('trust proxy', true); 

    // Middleware koji prati dolazne IP adrese i dodaje ih u listu
    app.use((req, res, next) => {
        // Koristimo 'x-forwarded-for' da bismo dobili stvarnu IP adresu korisnika
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        // Dodajemo IP adresu ako nije već u listi
        if (!connectedIps.includes(ip)) {
            connectedIps.push(ip);
        }

        // Ako je POST zahtev i ima poruku, dodajemo je u listu sa IP adresom
        if (req.method === 'POST' && req.body.message) {
            messages.push({ ip, message: req.body.message });
        }

        next(); // Nastavljamo sa obradom zahteva
    });

    // Ruta za prikazivanje IP adresa
    app.get('/ip-list', (req, res) => {
        res.json(connectedIps);  // Šaljemo listu IP adresa
    });

    // Ruta za prikazivanje poruka i IP adresa
    app.get('/messages', (req, res) => {
        res.json(messages);  // Šaljemo sve poruke i njihove IP adrese
    });
};
