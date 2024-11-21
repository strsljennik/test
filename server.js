const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { connectDB } = require('./mongo');
const { register, login } = require('./prijava');
const { initializeStorage, saveGuestData, loadGuestData } = require('./storage');
const { v4: uuidv4 } = require('uuid');  // Uvezi uuid biblioteku

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
    const uniqueId = uuidv4();  // Generiši UUID za svakog gosta
    const uniqueNumber = generateUniqueNumber();
    const nickname = `Gost-${uniqueNumber}`;

    // Dodaj goste u objekat sa socket ID kao ključ i UUID kao podatak
    guests[socket.id] = { uuid: uniqueId, nickname };

    // Spasi podatke gosta koristeći UUID
    await saveGuestData(uniqueId, { nickname, socketId: socket.id, color: null, ipAddress: socket.handshake.address });

    console.log(`${nickname} (Socket ID: ${socket.id}) se povezao.`);

    // Emituj novog gosta svim korisnicima
    io.emit('newGuest', nickname);
    io.emit('updateGuestList', Object.values(guests).map(guest => guest.nickname));

    socket.on('chatMessage', (msgData) => {
        const time = new Date().toLocaleTimeString();
        const messageToSend = {
            text: msgData.text,
            bold: msgData.bold,
            italic: msgData.italic,
            color: msgData.color,
            nickname: guests[socket.id].nickname,  // Prikazujemo nickname sa socket ID-om
            time: time
        };
        io.emit('chatMessage', messageToSend);  // Pošaljemo poruku svim korisnicima
    });

    socket.on('disconnect', async () => {
        console.log(`${guests[socket.id].nickname} (Socket ID: ${socket.id}) se odjavio.`);
        assignedNumbers.delete(parseInt(guests[socket.id].nickname.split('-')[1], 10));

        // Obrisi podatke gosta kada se odjavi koristeći UUID
        await saveGuestData(guests[socket.id].uuid, null);

        delete guests[socket.id];
        io.emit('updateGuestList', Object.values(guests).map(guest => guest.nickname));  // Ažuriraj listu gostiju
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
