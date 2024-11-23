const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { connectDB } = require('./mongo');
const { register, login } = require('./prijava');
const { initializeStorage, saveGuestData, loadGuestData } = require('./storage');
require('dotenv').config();
require('./ping');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

connectDB();
initializeStorage(); // Inicijalizuj storage pre nego što nastavimo sa serverom

app.use(express.json());
app.use(express.static(__dirname + '/public'));

app.post('/register', (req, res) => register(req, res, io));
app.post('/login', (req, res) => login(req, res, io));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

const authorizedUsers = new Set(['Radio Galaksija', 'ZI ZU', '__X__']);
let guests = {};
let assignedNumbers = new Set();

async function loadGuests() {
    // Učitaj sve goste iz skladišta
    const loadedGuests = await loadGuestData();
    for (let guest of loadedGuests) {
        guests[guest.id] = guest; // Pretpostavljamo da guest ima id, nickname i druge atribute
    }
}

io.on('connection', async (socket) => {
    await loadGuests(); // Učitaj prethodne goste

    // Postavi inicijalne podatke za gosta
    const existingGuest = guests[socket.id] || { nickname: `Gost-${generateUniqueNumber()}` };
    guests[socket.id] = existingGuest;

    console.log(`${existingGuest.nickname} se povezao.`);
    saveGuestData(socket.id, existingGuest); // Spasi podatke gosta u storage

    socket.broadcast.emit('newGuest', existingGuest.nickname);
    io.emit('updateGuestList', Object.values(guests));

    socket.on('userLoggedIn', async (username) => {
        if (authorizedUsers.has(username)) {
            guests[socket.id] = { nickname: `${username} (Admin)` };
            console.log(`${username} je autentifikovan kao admin.`);
        } else {
            guests[socket.id] = { nickname: username };
            console.log(`${username} se prijavio kao gost.`);
        }
        await saveGuestData(socket.id, guests[socket.id]); // Ažuriraj podatke gosta u storage
        io.emit('updateGuestList', Object.values(guests));
    });

    socket.on('chatMessage', (msgData) => {
        const time = new Date().toLocaleTimeString();
        const messageToSend = {
            text: msgData.text,
            bold: msgData.bold,
            italic: msgData.italic,
            color: msgData.color,
            nickname: guests[socket.id].nickname,
            time: time
        };
        io.emit('chatMessage', messageToSend);
    });

    socket.on('disconnect', async () => {
        console.log(`${guests[socket.id].nickname} se odjavio.`);
        await saveGuestData(socket.id, guests[socket.id]); // Očuvaj podatke
        delete guests[socket.id]; // Obriši gosta iz trenutne liste
        io.emit('updateGuestList', Object.values(guests));
    });
});

// Funkcija za generisanje jedinstvenog broja
function generateUniqueNumber() {
    let number;
    do {
        number = Math.floor(Math.random() * 8889) + 1111;
    } while (assignedNumbers.has(number));
    assignedNumbers.add(number);
    return number;
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server je pokrenut na portu ${PORT}`);
});
