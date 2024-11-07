const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { connectDB, User } = require('./mongo');
const bcrypt = require('bcrypt');
const { spawn } = require('child_process');
const session = require("express-session");
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Poveži se sa bazom podataka
connectDB();

let users = {}; // Objekat sa korisnicima i njihovim ID-ovima
let assignedNumbers = new Set(); // Skup brojeva koji su već dodeljeni

app.use(express.json());
app.use(express.static(__dirname + '/public'));

// Konfiguracija sesije
app.use(session({
    secret: process.env.SECRET_KEY, // Koristi varijablu okruženja
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 3 // 3 sata
    }
}));

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });

    try {
        await user.save();
        res.status(201).send('User registered');
    } catch (err) {
        console.error('Greška prilikom registracije:', err);
        res.status(400).send('Error registering user');
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required.');
    }

    const user = await User.findOne({ username });

    if (user && await bcrypt.compare(password, user.password)) {
        io.emit('userLoggedIn', username);
        res.send('Logged in');
    } else {
        res.status(400).send('Invalid credentials');
    }
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Generiši broj u opsegu 1111-9999 koji još nije dodeljen
function generateUniqueNumber() {
    let number;
    do {
        number = Math.floor(Math.random() * 8889) + 1111;
    } while (assignedNumbers.has(number));
    assignedNumbers.add(number);
    return number;
}

io.on('connection', (socket) => {
    console.log('Novi korisnik je povezan');

    const userId = socket.id;
    const uniqueNumber = generateUniqueNumber();
    const nickname = `Gost-${uniqueNumber}`;

    users[userId] = nickname;
    console.log(`${nickname} se povezao.`);

    socket.broadcast.emit('newGuest', nickname);
    io.emit('updateGuestList', Object.values(users));

    socket.on('userLoggedIn', (username) => {
        users[userId] = username;
        io.emit('updateGuestList', Object.values(users));
    });

    socket.on('chatMessage', (msgData) => {
        const time = new Date().toLocaleTimeString();
        const messageToSend = {
            text: msgData.text,
            bold: msgData.bold,
            italic: msgData.italic,
            color: msgData.color,
            nickname: users[userId],
            time: time
        };
        io.emit('chatMessage', messageToSend);
    });

    socket.on('disconnect', () => {
        console.log(`${users[userId]} se odjavio.`);
        assignedNumbers.delete(parseInt(users[userId].split('-')[1], 10)); // Ukloni broj iz dodeljenih
        delete users[userId];
        io.emit('updateGuestList', Object.values(users));
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server je pokrenut na portu ${PORT}`);
});
