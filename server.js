const express = require('express');
const http = require('http');
const socketIo = require('socket.io');  // Proveri da je ovo pravilno
const { connectDB } = require('./mongo');
const { register, login } = require('./prijava');
const { loadUserData, saveUserData, updateUserColor } = require('./userData');  
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);  // Ovdje inicijalizuj io

connectDB();

app.use(express.json());
app.use(express.static(__dirname + '/public'));

app.post('/register', (req, res) => register(req, res, io));
app.post('/login', (req, res) => login(req, res, io));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Niz sa ovlašćenim korisnicima
const authorizedUsers = new Set(['Radio Galaksija', 'ZI ZU', '__X__']);
const bannedUsers = new Set(); // Banovani korisnici
let guests = {};
let assignedNumbers = new Set();

io.on('connection', (socket) => {
    const users = loadUserData();  // Učitaj sve korisnike
    const uniqueNumber = generateUniqueNumber();  // Koristi funkciju za generisanje broja
    const username = `Gost-${uniqueNumber}`;
    const userColor = '#FF0000';  // Početna boja (možeš promeniti)

    // Dodaj korisnika u goste sa svim podacima
    guests[socket.id] = { username, color: userColor };
    saveUserData(username, userColor);  // Spremi novog korisnika u JSON fajl

    console.log(`${username} se povezao sa bojom ${userColor}.`);

    socket.broadcast.emit('newGuest', username);  // Emituj za sve korisnike
    io.emit('updateGuestList', Object.values(guests));  // Emituj sve goste

    socket.on('userLoggedIn', (username) => {
        if (authorizedUsers.has(username)) {
            guests[socket.id].username = `${username} (Admin)`;  // Ažuriraj objekat
            console.log(`${username} je autentifikovan kao admin.`);
        } else {
            guests[socket.id].username = username;  // Ažuriraj objekat
            console.log(`${username} se prijavio kao gost.`);
        }
        io.emit('updateGuestList', Object.values(guests));  // Ažuriraj listu gostiju
    });

    socket.on('chatMessage', (msgData) => {
        const time = new Date().toLocaleTimeString();
        const messageToSend = {
            text: msgData.text,
            bold: msgData.bold,
            italic: msgData.italic,
            color: msgData.color,
            nickname: guests[socket.id].username,
            time: time
        };
        io.emit('chatMessage', messageToSend);  // Emituj chat poruku
    });

    socket.on('changeColor', (newColor) => {
        guests[socket.id].color = newColor;
        updateUserColor(username, newColor);  // Ažuriraj boju u JSON fajlu
        io.emit('updateGuestList', Object.values(guests));  // Ažuriraj listu gostiju
    });

    socket.on('disconnect', () => {
        console.log(`${guests[socket.id].username} se odjavio.`);
        assignedNumbers.delete(parseInt(guests[socket.id].username.split('-')[1], 10));
        delete guests[socket.id];
        io.emit('updateGuestList', Object.values(guests));  // Ažuriraj listu pri odjavi
    });

    socket.on('banUser', (userIdToBan) => {
        if (!authorizedUsers.has(guests[socket.id].username.split(' ')[0])) {
            socket.emit('error', 'Nemate ovlašćenje za banovanje korisnika.');
            return;
        }
        if (!bannedUsers.has(userIdToBan)) {
            bannedUsers.add(userIdToBan);
            io.emit('userBanned', userIdToBan);  // Emituj banovanje
            console.log(`Korisnik ${userIdToBan} je banovan od strane ${guests[socket.id].username}.`);
        }
    });

    socket.on('unbanUser', (userIdToUnban) => {
        if (!authorizedUsers.has(guests[socket.id].username.split(' ')[0])) {
            socket.emit('error', 'Nemate ovlašćenje za odbanovanje korisnika.');
            return;
        }
        if (bannedUsers.has(userIdToUnban)) {
            bannedUsers.delete(userIdToUnban);
            io.emit('userUnbanned', userIdToUnban);  // Emituj odbanovanje
            console.log(`Korisnik ${userIdToUnban} je oslobođen od strane ${guests[socket.id].username}.`);
        }
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
