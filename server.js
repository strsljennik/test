const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { connectDB, User } = require('./mongo');
const bcrypt = require('bcrypt');
const { spawn } = require('child_process');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Definiši administratorske podatke
const adminUsername = "Radio Galaksija";
const adminPassword = "marakana100-";

connectDB();

let users = {}; // Promeni listu korisnika u objekat
let isAdminLoggedIn = false; // Praćenje da li je admin prijavljen

app.use(express.json());
app.use(express.static(__dirname + '/public'));

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

    // Provera za admina
    if (username === adminUsername && password === adminPassword) {
        isAdminLoggedIn = true; // Postavi admin status na true
        return res.json({ message: 'Admin logged in', isAdmin: true });
    }

    // Provera ostalih korisnika
    const user = await User.findOne({ username });

    if (user && await bcrypt.compare(password, user.password)) {
        io.emit('userLoggedIn', username);
        res.json({ message: 'Logged in', isAdmin: false });
    } else {
        res.status(400).send('Invalid credentials');
    }
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Socket.io veza
io.on('connection', (socket) => {
    console.log('Novi korisnik je povezan');
    const userId = socket.id;

    // Provera da li je admin prijavljen i postavljanje njegovog imena
    if (isAdminLoggedIn) {
        users[userId] = adminUsername; // Dodeli adminu ime bez dodavanja u listu gostiju
        socket.emit('adminConnected', adminUsername);
        isAdminLoggedIn = false; // Resetuj status nakon prijave admina
    } else {
        // Dodeli korisničko ime običnim korisnicima
        const nickname = `Korisnik-${Object.keys(users).length + 1}`;
        users[userId] = nickname;
        socket.broadcast.emit('newGuest', nickname);
        io.emit('updateGuestList', Object.values(users));
    }

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
        delete users[userId];
        io.emit('updateGuestList', Object.values(users));
    });

    socket.on('play_song', (songUrl) => {
        socket.broadcast.emit('play_song', songUrl);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server je pokrenut na portu ${PORT}`);
});
