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

// Poveži se sa bazom podataka
connectDB();

let users = {}; // Promeni listu korisnika u objekat

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

    const user = await User.findOne({ username });

    if (user && await bcrypt.compare(password, user.password)) {
// Emituj događaj kada se korisnik uloguje
        io.emit('userLoggedIn', username);

        res.send('Logged in');
    } else {
        res.status(400).send('Invalid credentials');
    }
});

// Glavna ruta
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Socket.io veza
io.on('connection', (socket) => {
    console.log('Novi korisnik je povezan');

    // Dodeli socket.id kao jedinstveni ID korisniku
    const userId = socket.id; 
    const nickname = `Korisnik-${Object.keys(users).length + 1}`; // Generiši nickname

    // Dodaj korisnika u objekat
    users[userId] = nickname; 
    console.log(`${nickname} se povezao.`);

    // Obavesti ostale korisnike o novom gostu
    socket.broadcast.emit('newGuest', nickname);
    io.emit('updateGuestList', Object.values(users)); // Ažuriraj listu gostiju

 // Kada korisnik uspešno uloguje i promeni nickname
    socket.on('userLoggedIn', (username) => {
        users[userId] = username; // Promeni korisnikov nickname
        io.emit('updateGuestList', Object.values(users)); // Ažuriraj listu za sve korisnike
    });


    socket.on('chatMessage', (msgData) => {
        const time = new Date().toLocaleTimeString();
        const messageToSend = {
            text: msgData.text,
            bold: msgData.bold,
            italic: msgData.italic,
            color: msgData.color,
            nickname: users[userId], // Koristi nickname iz objekta
            time: time
        };
        io.emit('chatMessage', messageToSend);
    });

 
    socket.on('disconnect', () => {
        console.log(`${users[userId]} se odjavio.`);
        // Ukloni korisnika iz objekta koristeći socket ID
        delete users[userId];
        io.emit('updateGuestList', Object.values(users)); // Ažuriraj listu gostiju
    });
// Kada klijent pošalje play_song događaj, emituj ga ostalim klijentima
    socket.on('play_song', (songUrl) => {
        socket.broadcast.emit('play_song', songUrl);
    });


    
});

// Pokreni server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server je pokrenut na portu ${PORT}`);
});