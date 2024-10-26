const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { connectDB, User } = require('./mongo');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Povezivanje sa bazom podataka
connectDB();

let users = {}; // Lista korisnika kao objekat
const adminUsername = "Radio Galaksija"; // Definišemo admina

app.use(express.json());
app.use(express.static(__dirname + '/public'));

// Registracija
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

// Login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required.');
    }

    const user = await User.findOne({ username });

    if (user && await bcrypt.compare(password, user.password)) {
        res.send('Logged in');
        io.emit('userLoggedIn', username);
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
    const userId = socket.id;
    const nickname = `Korisnik-${Object.keys(users).length + 1}`; // Generiši nickname

    // Dodaj korisnika u objekat
    users[userId] = nickname;
    console.log(`${nickname} se povezao.`);
    
    // Emituj trenutnu listu gostiju
    io.emit('updateGuestList', Object.values(users));

    // Kada se uloguje admin, preuzima kontrolu
    socket.on('userLoggedIn', (username) => {
        if (username === adminUsername) {
            // Ako je već prijavljen sa "Radio Galaksija", izbegavamo duplikat
            const adminExists = Object.values(users).includes(adminUsername);

            if (adminExists) {
                // Nađemo korisnika koji koristi admin nick i prevezemo ga na novi socket
                const adminSocketId = Object.keys(users).find(id => users[id] === adminUsername);
                delete users[adminSocketId]; // Izbacujemo starog
            }

            users[userId] = adminUsername; // Novo povezivanje kao admin
            io.emit('updateGuestList', Object.values(users)); // Osveži listu
            socket.emit('adminControlsEnabled'); // Omogući kontrolu radija za admina

            console.log(`Korisnik ${adminUsername} preuzeo kontrolu kao admin.`);
        } else {
            users[userId] = username;
            io.emit('updateGuestList', Object.values(users));
        }
    });

    // Kada korisnik pošalje poruku
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

    // Kada admin kontroliše muziku
    socket.on('play_song', (songUrl) => {
        if (users[userId] === adminUsername) {
            socket.broadcast.emit('play_song', songUrl);
        }
    });

    // Kada korisnik prekine vezu
    socket.on('disconnect', () => {
        console.log(`${users[userId]} se odjavio.`);
        delete users[userId];
        io.emit('updateGuestList', Object.values(users));
    });
});

// Pokreni server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server je pokrenut na portu ${PORT}`);
});
