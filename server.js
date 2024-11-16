// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { connectDB } = require('./mongo');
const { register, login } = require('./prijava'); // Uvozimo register i login funkcije
const { setupSocketEvents } = require('./banModule'); // Uvoz setupSocketEvents funkcije za banovanje
const { saveMessage, loadAllUsers, saveUser, getUserBySession } = require('./poruke');

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Inicijalizacija objekata za goste i postavke korisnika
const guests = {}; // Ovdje čuvamo sve goste sa njihovim socket ID-evima
const User = require('./models/User'); // Ako koristiš model za korisnike
const userSettings = {}; // Ovdje čuvamo postavke svakog korisnika, kao što su boja i nadimak

// Povezivanje sa bazom podataka
connectDB().catch((err) => {
    console.error("Greška prilikom povezivanja sa bazom podataka:", err);
    process.exit(1); // Zaustavi server ako se ne može povezati
});

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

// Socket.io događaji
setupSocketEvents(io);

io.on('connection', async (socket) => {
    console.log('Novi gost je povezan sa socket ID:', socket.id);

    const guestId = socket.id;

    // Generisanje korisničkog imena
    socket.username = socket.handshake.query.username || `Gost-${generateUniqueNumber()}`;
    console.log(`${socket.username} se povezao.`);

    // Dodajemo gosta u listu gostiju i postavke
    guests[guestId] = socket.username;
    userSettings[guestId] = { nickname: socket.username, color: '#800000' }; // Postavke sa početnim vrednostima

    // Inicijalizuj sve korisnike sa podacima iz baze nakon restarta servera
    const users = await loadAllUsers(); // Učitavamo sve korisnike iz baze
    users.forEach(user => {
        guests[user.sessionId] = user.nickname;
        userSettings[user.sessionId] = {
            nickname: user.nickname,
            color: user.color,
        };
    });

    // Emitovanje događaja za povezivanje novog gosta
    socket.broadcast.emit('newGuest', socket.username);
    io.emit('updateGuestList', Object.values(guests));

    // Pošaljemo postavke svim korisnicima na konekciju
    socket.emit('updateSettings', userSettings);

    // Dodajemo funkcionalnost za setovanje korisničkog imena i povezivanje sa sessionId
    handleSocketConnection(socket);

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
    socket.on('chatMessage', async (msgData) => {
        const time = new Date().toLocaleTimeString('en-US', { timeZone: 'Europe/Berlin' });
        const messageToSend = {
            text: msgData.text,
            bold: msgData.bold,
            italic: msgData.italic,
            color: msgData.color,
            nickname: guests[guestId],
            time: time
        };

        // Čuvanje poruke u bazi
        await saveMessage(messageToSend);

        // Emitovanje poruke svim korisnicima
        io.emit('chatMessage', messageToSend);
    });

    // Rukovanje odjavom korisnika
    socket.on('disconnect', () => {
        console.log(`${guests[guestId]} se odjavio.`);
        delete guests[guestId];
        delete userSettings[guestId]; // Uklanjanje postavki korisnika pri disconnectu
        io.emit('updateGuestList', Object.values(guests));
        io.emit('updateSettings', userSettings); // Ažuriraj sve korisnike sa novim postavkama
    });
});

// Generisanje jedinstvenog broja za goste
function generateUniqueNumber() {
    let number;
    do {
        number = Math.floor(Math.random() * 8889) + 1111;
    } while (Object.values(guests).includes(`Gost-${number}`));
    return number;
}

// Funkcija za povezivanje korisničkog imena sa sessionId
const handleSocketConnection = (socket) => {
    socket.on('setUsername', async (nickname, color) => {
        try {
            const existingUser = await getUserBySession(socket.id);
            if (!existingUser) {
                const sessionId = socket.id; // Koristimo socket.id kao sessionId
                await saveUser(nickname, color, sessionId); // Sačuvaj korisnika u bazi
            }
            socket.emit('usernameSet', nickname); // Pošaljemo korisniku potvrdu
        } catch (err) {
            console.error(err);
        }
    });
};

// Pokretanje servera
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server je pokrenut na portu ${PORT}`);
});
