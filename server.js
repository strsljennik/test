const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { connectDB } = require('./mongo');
const { register, login } = require('./prijava');  // Uvozimo register i login funkcije
require('dotenv').config();
const { setupSocketEvents } = require('./banmodule'); // Putanja do banmodule.js
const konobarica = require('./konobaricamodul');

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

    const guestId = socket.id;
    const ip = socket.request.connection.remoteAddress;
    console.log(`Gost sa IP adresom ${ip} se povezao.`);

    if (!connectedIps.includes(ip)) {
        connectedIps.push(ip);
    }

    const uniqueNumber = generateUniqueNumber();
    const nickname = `Gost-${uniqueNumber}`;
    const color = 'defaultColor';  // Početna boja

    // Čuvamo sve relevantne podatke za gosta
    guests[guestId] = { nickname: nickname, color: color, number: uniqueNumber };
    console.log(`${nickname} se povezao.`);

    socket.broadcast.emit('newGuest', nickname);
    emitUpdatedGuestList(); // Emituj prvobitnu listu gostiju

    socket.on('userLoggedIn', (username) => {
        guests[guestId].nickname = username;
        emitUpdatedGuestList(); // Emituj ažuriranu listu gostiju
    });

    socket.on('changeColor', (newColor) => {
        guests[guestId].color = newColor;  // Menjanje boje
        emitUpdatedGuestList(); // Emituj ažuriranu listu gostiju
    });

    socket.on('chatMessage', (msgData) => {
        const time = new Date().toLocaleTimeString();
        const messageToSend = {
            text: msgData.text,
            bold: msgData.bold,
            italic: msgData.italic,
            color: msgData.color,
            nickname: guests[guestId].nickname,
            time: time
        };
        io.emit('chatMessage', messageToSend);
    });

    socket.on('disconnect', () => {
        console.log(`${guests[guestId].nickname} se odjavio.`);
        assignedNumbers.delete(guests[guestId].number); // Ukloni broj iz dodeljenih brojeva
        delete guests[guestId];
        connectedIps = connectedIps.filter((userIp) => userIp !== ip);
        emitUpdatedGuestList(); // Emituj ažuriranu listu gostiju
    });
});

// Funkcija za emitovanje ažurirane liste korisnika
function emitUpdatedGuestList() {
    const updatedGuestList = Object.values(guests).map(guest => ({
        nickname: guest.nickname,
        color: guest.color,
        number: guest.number
    }));
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
