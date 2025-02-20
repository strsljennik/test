const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { connectDB } = require('./mongo');
const { register, login } = require('./prijava');
const { setupSocketEvents } = require('./banmodul'); // Uvoz funkcije iz banmodula
const konobaricaModul = require('./konobaricamodul'); // Uvoz konobaricamodul.js
const slikemodul = require('./slikemodul');
const pingService = require('./ping');
const privatmodul = require('./privatmodul'); // Podesi putanju ako je u drugom folderu
require('dotenv').config();
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*', // Omogućava svim domenima da se povežu putem WebSocket-a
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        credentials: true
    }
});

connectDB(); // Povezivanje na bazu podataka
konobaricaModul(io);
slikemodul.setSocket(io);

// Middleware za parsiranje JSON podataka i serviranje statičkih fajlova
app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.set('trust proxy', true);
app.use(cors());

// Rute za registraciju i prijavu
app.post('/register', (req, res) => register(req, res, io));
app.post('/login', (req, res) => login(req, res, io));

// Početna ruta
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});
// Lista autorizovanih i banovanih korisnika
const authorizedUsers = new Set(['Radio Galaksija', 'ZI ZU', '*__X__*']);
const bannedUsers = new Set();

// Skladištenje informacija o gostima
const guests = {};
const guestsData = {};
let newColor;
const assignedNumbers = new Set(); // Set za generisane brojeve

// Dodavanje socket događaja iz banmodula
setupSocketEvents(io, guests, bannedUsers); // Dodavanje guests i bannedUsers u banmodul
privatmodul(io, guests);
let currentBackground = "";

// Socket.io događaji
io.on('connection', (socket) => {
    // Generisanje jedinstvenog broja za gosta
    const uniqueNumber = generateUniqueNumber();
    const nickname = `Gost-${uniqueNumber}`; // Nadimak korisnika
    guests[socket.id] = nickname; // Dodajemo korisnika u guest list
 socket.emit('setNickname', nickname);
    const ipList = socket.handshake.headers['x-forwarded-for'];
const ipAddress = ipList ? ipList.split(',')[0].trim() : socket.handshake.address;

// Funkcija za generisanje jedinstvenog broja
    function generateUniqueNumber() {
        let number;
        do {
            number = Math.floor(Math.random() * 8889) + 1111; // Brojevi između 1111 i 9999
        } while (assignedNumbers.has(number));
        assignedNumbers.add(number);
        return number;
    }

socket.broadcast.emit('newGuest', nickname);
io.emit('updateGuestList', Object.values(guests));
io.emit('logMessage', `${guests[socket.id]} se povezao. IP adresa: ${ipAddress}`);

socket.on('userLoggedIn', (username) => {
    io.emit('logMessage', `${guests[socket.id]} je ${username}. IP adresa: ${ipAddress}`);
    
    if (authorizedUsers.has(username)) {
        // Ovdje možeš dodati specifične akcije za autorizovane korisnike, ako su potrebne
    }
     guests[socket.id] = username;
    io.emit('updateGuestList', Object.values(guests));
});

   // Obrada slanja chat poruka
    socket.on('chatMessage', (msgData) => {
        const time = new Date().toLocaleTimeString();
        const messageToSend = {
            text: msgData.text,
            bold: msgData.bold,
            italic: msgData.italic,
            color: msgData.color,
             underline: msgData.underline,
            overline: msgData.overline,
            nickname: guests[socket.id],
            time: time,
        };
        io.emit('chatMessage', messageToSend);
    });

  // Obrada za čišćenje chata
    socket.on('clear-chat', () => {
        console.log('Chat cleared');
        io.emit('chat-cleared');
    });
 
// Poslati trenutne goste sa bojama novom gostu
socket.emit('currentGuests', Object.keys(guestsData).map(guestId => ({
    guestId: guestId,
    color: guestsData[guestId].color
})));

// Kada gost menja svoju boju
socket.on('updateGuestColor', ({ guestId, newColor }) => {
    // Ažuriraj boju gosta na serveru
    if (!guestsData[guestId]) {
        guestsData[guestId] = { color: '' }; // Osiguraj da postoji guestId
    }
    guestsData[guestId].color = newColor;

    // Emituje promenu boje svim klijentima
    io.emit('updateGuestColor', { guestId, newColor });
});
      socket.emit("updateBackground", currentBackground);

    socket.on("changeBackground", (url) => {
        console.log("Nova pozadina:", url);
        currentBackground = url;
        io.emit("updateBackground", url);
    });

// Obrada diskonekcije korisnika
    socket.on('disconnect', () => {
        console.log(`${guests[socket.id]} se odjavio. IP adresa korisnika: ${ipAddress}`);
        delete guests[socket.id];
        io.emit('updateGuestList', Object.values(guests));
    });
     });
// Pokretanje servera na definisanom portu
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server je pokrenut na portu ${PORT}`);
});
