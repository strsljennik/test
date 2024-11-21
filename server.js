const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { connectDB } = require('./mongo');
const { register, login } = require('./prijava');
const { initializeStorage, saveGuestData, loadGuestData } = require('./storage');

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
let assignedNumbers = new Set();

io.on('connection', async (socket) => {
    const uniqueNumber = generateUniqueNumber();
    const nickname = `Gost-${uniqueNumber}`;
    guests[socket.id] = nickname;

    await saveGuestData(socket.id, nickname);  // Spasi podatke gosta u storage
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
        assignedNumbers.delete(parseInt(guests[socket.id].split('-')[1], 10));
        await saveGuestData(socket.id, null);  // Obrisi podatke gosta kad se odjavi
        delete guests[socket.id];
        io.emit('updateGuestList', Object.values(guests));  // Ažuriraj listu gostiju
    });
});

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
