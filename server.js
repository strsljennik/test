const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { connectDB } = require('./mongo');
const { register, login } = require('./prijava');  // Uvozimo register i login funkcije
require('dotenv').config();
const { setupSocketEvents } = require('./banModule'); // Putanja do banmodule.js
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
let guests = {};  // Svi gosti sa njihovim podacima
let assignedNumbers = new Set();  // Set za dodeljene brojeve
let connectedIps = [];  // Lista povezanih IP adresa

io.on('connection', (socket) => {
    console.log('Novi gost je povezan sa socket ID:', socket.id);

    // Generisanje jedinstvenog broja za svakog gosta
    const uniqueNumber = generateUniqueNumber();
    const guestId = socket.id;  // Koristimo socket.id kao guestId
    const nickname = `Gost-${uniqueNumber}`;
    
    guests[guestId] = nickname;  // Dodajemo novog gosta sa njegovim nickom
    console.log(`${nickname} se povezao.`);

    socket.broadcast.emit('newGuest', nickname);
    emitUpdatedGuestList();  // Emituj listu gostiju

    // Kada se korisnik prijavi sa svojim username-om
    socket.on('userLoggedIn', (username) => {
        guests[guestId] = username;  // Ažuriramo nickname
        emitUpdatedGuestList();  // Emituj ažuriranu listu gostiju
    });

    // Handling chat messages
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

    // Kada se korisnik odjavi
    socket.on('disconnect', () => {
        console.log(`${guests[guestId]} se odjavio.`);
        assignedNumbers.delete(parseInt(guests[guestId].split('-')[1], 10));  // Oslobađanje broja
        delete guests[guestId];  // Brisanje gosta iz liste
        emitUpdatedGuestList();  // Emituj ažuriranu listu gostiju
    });

// Funkcija za emitovanje ažurirane liste korisnika
function emitUpdatedGuestList() {
    const updatedGuestList = Object.values(guests);
    io.emit('updateGuestList', updatedGuestList);  // Emituj novu listu korisnika
}

// Generisanje jedinstvenog broja za goste
function generateUniqueNumber() {
    let number;
    do {
        number = Math.floor(Math.random() * 8889) + 1111;
    } while (assignedNumbers.has(number));  // Proveri da li je broj već dodeljen
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
