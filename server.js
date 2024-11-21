const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { connectDB } = require('./mongo');
const { register, login } = require('./prijava');
const { initializeStorage, saveGuestData, loadGuestData } = require('./storage');
const { v4: uuidv4 } = require('uuid');  // Import UUID generator

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

connectDB();
initializeStorage();  // Inicijalizuj storage pre nego što nastavimo sa serverom

app.use(express.json());
app.use(express.static(__dirname + '/public'));

app.post('/register', (req, res) => register(req, res, io));
app.post('/login', (req, res) => login(req, res, io));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

let guests = {};

io.on('connection', async (socket) => {
    const uuid = uuidv4();  // Generiši UUID za novog gosta
    const nickname = `Gost-${uuid}`;  // Korišćenje UUID kao nickname
    guests[socket.id] = nickname;

    await saveGuestData(uuid, nickname);  // Spasi podatke gosta u storage
    console.log(`${nickname} se povezao.`);

    io.emit('newGuest', nickname);  // Emituj novog gosta svim korisnicima
    io.emit('updateGuestList', Object.values(guests));  // Ažuriraj listu gostiju

    socket.on('chatMessage', (msgData) => {
        const time = new Date().toLocaleTimeString();
        const messageToSend = {
            text: msgData.text,
            bold: msgData.bold,
            italic: msgData.italic,
            color: msgData.color,
            nickname: guests[socket.id],
            time: time
        };
        io.emit('chatMessage', messageToSend);  // Pošaljemo poruku svim korisnicima
    });

    socket.on('disconnect', async () => {
        console.log(`${guests[socket.id]} se odjavio.`);
        await saveGuestData(socket.id, null);  // Obrisi podatke gosta kad se odjavi
        delete guests[socket.id];
        io.emit('updateGuestList', Object.values(guests));  // Ažuriraj listu gostiju
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server je pokrenut na portu ${PORT}`);
});
