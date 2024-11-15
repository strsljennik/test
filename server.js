// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { connectDB } = require('./mongo');
const { register, login } = require('./prijava'); // Uvozimo register i login funkcije
const { setupSocketEvents } = require('./banModule'); // Uvoz setupSocketEvents funkcije za banovanje
const konobarica = require('./konobaricamodul');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Povezivanje sa bazom podataka
connectDB();

// Middleware za parsiranje JSON-a i statičkih fajlova
app.use(express.json());
app.use(express.static(__dirname + '/public'));

// Ruta za registraciju korisnika
app.post('/register', (req, res) => register(req, res, io));

// Ruta za prijavu korisnika
app.post('/login', (req, res) => login(req, res, io));

// Endpoint za glavnu stranicu
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Globalne promenljive
let guests = {}; // Objekt koji čuva korisnike
let assignedNumbers = new Set();
let connectedIps = [];
let userSettings = {}; // Novi objekat za čuvanje postavki korisnika (nickname, boja)

// Socket.io događaji
setupSocketEvents(io);

io.on('connection', (socket) => {
    console.log('Novi gost je povezan sa socket ID:', socket.id);

    const guestId = socket.id;
    const ip = socket.request.connection.remoteAddress;
    console.log(`Gost sa IP adresom ${ip} se povezao.`);

    // Dodavanje IP adrese u listu povezanih ako već nije dodata
    if (!connectedIps.includes(ip)) {
        connectedIps.push(ip);
    }

    // Generisanje korisničkog imena
    socket.username = socket.handshake.query.username || `Gost-${generateUniqueNumber()}`;
    guests[guestId] = socket.username;

    // Inicijalizacija postavki za novog gosta
    userSettings[guestId] = { nickname: socket.username, color: "#000000" }; // Početna boja je crna
    console.log(`${socket.username} se povezao.`);

    // Emitovanje događaja za povezivanje novog gosta
    socket.broadcast.emit('newGuest', socket.username);
    io.emit('updateGuestList', Object.values(guests));

    // Pošaljemo postavke svim korisnicima na konekciju
    socket.emit('updateSettings', userSettings);

    // Rukovanje događajem kada se korisnik prijavi (menja nickname)
    socket.on('userLoggedIn', (username) => {
        if (username) {
            console.log(`Korisnik ${guests[guestId]} promenjen na ${username}`);
            guests[guestId] = username;
            userSettings[guestId].nickname = username; // Ažuriraj nickname u postavkama
            io.emit('updateGuestList', Object.values(guests));
            io.emit('updateSettings', userSettings); // Pošaljemo sve postavke
        }
    });

    // Rukovanje promenom boje za korisnika
    socket.on('changeColor', (color) => {
        if (color) {
            userSettings[guestId].color = color; // Ažuriraj boju korisnika
            io.emit('updateSettings', userSettings); // Pošaljemo sve postavke
        }
    });

    // Rukovanje chat porukama
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

    // Rukovanje odjavom korisnika
    socket.on('disconnect', () => {
        console.log(`${guests[guestId]} se odjavio.`);
        assignedNumbers.delete(parseInt(guests[guestId].split('-')[1], 10));
        delete guests[guestId];
        delete userSettings[guestId]; // Uklanjanje postavki korisnika pri disconnectu
        connectedIps = connectedIps.filter((userIp) => userIp !== ip);
        io.emit('updateGuestList', Object.values(guests));
        io.emit('updateSettings', userSettings); // Ažuriraj sve korisnike sa novim postavkama
    });
});

// Generisanje jedinstvenog broja za goste
function generateUniqueNumber() {
    let number;
    do {
        number = Math.floor(Math.random() * 8889) + 1111;
    } while (assignedNumbers.has(number));
    assignedNumbers.add(number);
    return number;
}

// Pokretanje servera
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server je pokrenut na portu ${PORT}`);
});
