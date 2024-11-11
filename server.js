// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { connectDB, User } = require('./mongo');
const bcrypt = require('bcrypt');
require('dotenv').config();
const banModule = require("./banModule");
const ipModule = require('./ip');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Poveži se sa bazom podataka
connectDB();

app.use(express.json());
app.use(express.static(__dirname + '/public'));

// Proverava da li korisnik treba da bude admin ili gost
async function checkAdminRole(username) {
    if (username === 'Radio Galaksija') {
        const existingAdmin = await User.findOne({ role: 'admin' });
        if (!existingAdmin) return 'admin';
    }
    return 'guest';
}

// Ruta za registraciju korisnika
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required.');
    }

    const role = await checkAdminRole(username);  // Dobija rolu admina ako je "Radio Galaksija" i nema admina u bazi
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, role });

    try {
        await user.save();
        res.status(201).send('User registered');
    } catch (err) {
        console.error('Greška prilikom registracije:', err);
        res.status(400).send('Error registering user');
    }
});

// Ruta za prijavu korisnika
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const socketId = req.headers['x-socket-id']; // Socket ID primljen od klijenta u zaglavlju

    if (!username || !password) {
        return res.status(400).send('Username and password are required.');
    }

    try {
        const user = await User.findOne({ username });
        if (user && await bcrypt.compare(password, user.password)) {
            const role = user.role;
            const socket = io.sockets.sockets.get(socketId);

            // Emitovanje prijavljenom korisniku sa njegovim role podacima
            if (socket) {
                socket.emit('userLoggedIn', { username, role });
            }

            res.send(role === 'admin' ? 'Logged in as admin' : 'Logged in as guest');
        } else {
            res.status(400).send('Invalid credentials');
        }
    } catch (err) {
        console.error('Greška prilikom logovanja:', err);
        res.status(500).send('Server error');
    }
});

// Endpoint za glavnu stranicu
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
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

let guests = {};
let assignedNumbers = new Set();
let connectedIps = [];

// Konekcija sa socket-om za rad sa događajima na strani klijenta
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
    guests[guestId] = nickname;
    console.log(`${nickname} se povezao.`);

    if (banModule.isGuestBanned(guestId)) {
        socket.disconnect();
        return;
    }

    socket.broadcast.emit('newGuest', nickname);
    io.emit('updateGuestList', Object.values(guests));

    // Emitovanje događaja kad se korisnik prijavi
    socket.on('userLoggedIn', (username) => {
        guests[guestId] = username;
        io.emit('updateGuestList', Object.values(guests));
    });

    // Prijem poruka u četu
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

    // Banovanje korisnika samo od strane admina
    socket.on("toggleBanUser", (targetGuestId) => {
        if (guests[guestId] === "Radio Galaksija") {
            banModule.isGuestBanned(targetGuestId) ? 
                banModule.unbanGuest(targetGuestId) : 
                banModule.banGuest(targetGuestId);
            io.sockets.sockets.get(targetGuestId)?.disconnect();
            io.emit('updateGuestList', Object.values(guests));
        }
    });

    // Kada gost napusti čet
    socket.on('disconnect', () => {
        console.log(`${guests[guestId]} se odjavio.`);
        assignedNumbers.delete(parseInt(guests[guestId].split('-')[1], 10));
        delete guests[guestId];
        connectedIps = connectedIps.filter((userIp) => userIp !== ip);
        io.emit('updateGuestList', Object.values(guests));
    });
});

// Slušanje na određenom portu
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server je pokrenut na portu ${PORT}`);
});
