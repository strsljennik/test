const http = require('http');
const socketIo = require('socket.io');
const poruke = require('./poruke');  // Uvoz poruke.js modula

const server = http.createServer();
const io = socketIo(server);

io.on('connection', (socket) => {
    const guestId = socket.id;  // Definiši guestId kao socket.id
    console.log('Novi gost je povezan sa socket ID:', guestId);

    // Početni podaci korisnika
    const pocetniPodaci = poruke.pocetniPodaci();

    // Dodajemo korisnika u memoriju
    poruke.dodajKorisnika(guestId, pocetniPodaci);  

    // Kada korisnik menja podatke
    socket.on('updateUserData', (userColor, userNick, userNumber) => {
        const updatedUserData = { boja: userColor, nik: userNick, broj: userNumber };
        poruke.dodajKorisnika(guestId, updatedUserData);  // Ažuriramo podatke korisnika
    });

    // Kada korisnik isključi vezu
    socket.on('disconnect', () => {
        poruke.ukloniKorisnika(guestId);  // Brišemo korisnika kad izađe
    });
});

// Pokreni server
server.listen(3000, () => {
  console.log('Server je pokrenut na portu 3000');
});
