const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { connectDB } = require('./mongo');
const { register, login } = require('./prijava');  // Uvozimo register i login funkcije
require('dotenv').config();
const { setupSocketEvents } = require('./banModule'); // Putanja do banmodule.js
const konobarica = require('./konobaricamodul');
const poruke = require('./poruke');  // Uvoz poruke.js modula


const app = express();
const server = http.createServer(app);
const io = socketIo(server); // Definišemo io ovde

// Poveži se sa bazom podataka
connectDB();

app.use(express.json());
app.use(express.static(__dirname + '/public'));

// Ruta za registraciju korisnika
app.post('/register', (req, res) => register(req, res, io));  // Prosleđujemo io kao argument

// Ruta za prijavu korisnika
app.post('/login', (req, res) => login(req, res, io));  // Prosleđujemo io kao argument

// Endpoint za glavnu stranicu
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Konekcija sa socket-om za rad sa događajima na strani klijenta
let guests = {};
let assignedNumbers = new Set();
let connectedIps = [];

io.on('connection', (socket) => {
    console.log('Novi gost je povezan sa socket ID:', socket.id);

    poruke.dodajKorisnika(userId, pocetniPodaci);  // Dodaj korisnika u memoriju
    poruke.dodajKorisnika(userId, updatedUserData);  // Ažuriraj podatke korisnika
    poruke.ukloniKorisnika(userId);  // Briši podatke kada korisnik izađe



    const guestId = socket.id;
    const ip = socket.request.connection.remoteAddress;
    console.log(`Gost sa IP adresom ${ip} se povezao.`);

    if (!connectedIps.includes(ip)) {
        connectedIps.push(ip);
    }

    const uniqueNumber = generateUniqueNumber();
    const nickname = `Gost-${uniqueNumber}`;
    guests[guestId] = nickname;
    console.log(`${nickname} se povezao.`);

    socket.broadcast.emit('newGuest', nickname);
    emitUpdatedGuestList(); // Emituj prvobitnu listu gostiju

    socket.on('userLoggedIn', (username) => {
        guests[guestId] = username;
        emitUpdatedGuestList(); // Emituj ažuriranu listu gostiju
    });

    socket.on('chatMessage', (msgData) => {
        const time = new Date().toLocaleTimeString();
        const messageToSend = {
            text: msgData.text,
            bold: msgData.bold,
            italic: msgData.italic,
            color: msgData.color,
            nickname: guests[guestId],
            time: time
        };
        io.emit('chatMessage', messageToSend);
    });

    socket.on('disconnect', () => {
        console.log(`${guests[guestId]} se odjavio.`);
        assignedNumbers.delete(parseInt(guests[guestId].split('-')[1], 10));
        delete guests[guestId];
        connectedIps = connectedIps.filter((userIp) => userIp !== ip);
        emitUpdatedGuestList(); // Emituj ažuriranu listu gostiju
    });
});

// Funkcija za emitovanje ažurirane liste korisnika
function emitUpdatedGuestList() {
    const updatedGuestList = Object.values(guests);
    io.emit('updateGuestList', updatedGuestList); // Emituj novu listu korisnika
}

// Generisanje jedinstvenog broja za goste
function generateUniqueNumber() {
    let number;
    do {
        number = Math.floor(Math.random() * 8889) + 1111;
    } while (assignedNumbers.has(number));
    assignedNumbers.add(number);
    return number;
}

// Postavljanje socket događaja iz banmodule.js
setupSocketEvents(io);

konobarica(io);

// Slušanje na određenom portu
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server je pokrenut na portu ${PORT}`);
});
