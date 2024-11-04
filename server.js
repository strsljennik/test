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

    let ffmpeg; // Čuvanje FFmpeg procesa
    socket.on('start_stream', () => {
        console.log('Pokretanje audio stream-a...');

        ffmpeg = spawn('ffmpeg', [
            '-f', 'dshow',
            '-i', 'audio="CABLE Output (VB-Audio Virtual Cable)"', 
            '-f', 'dshow',
            '-i', 'audio="Mikrofon (Realtek High Definition Audio)"', 
            '-f', 'dshow',
            '-i', 'audio="Stereomix (Realtek High Definition Audio)"', 
            '-filter_complex', '[0:a][1:a][2:a]amix=inputs=3[a]',
            '-map', '[a]',
            'output.wav'
        ]);

        ffmpeg.stdout.on('data', (data) => {
            console.log('Audio streaming u toku...');
        });

        ffmpeg.stderr.on('data', (data) => {
            console.error(`FFmpeg stderr: ${data.toString()}`);
        });

        ffmpeg.on('close', (code) => {
            console.log(`FFmpeg proces je zatvoren sa kodom ${code}`);
            ffmpeg = null;
        });
    });

    socket.on('stop_stream', () => {
        if (ffmpeg) {
            ffmpeg.kill();
            console.log('Audio stream je zaustavljen.');
            ffmpeg = null;
        }
    });

    socket.on('signal', (data) => {
        socket.broadcast.emit('signal', data);
    });

    socket.on('disconnect', () => {
        console.log(`${users[userId]} se odjavio.`);
        // Ukloni korisnika iz objekta koristeći socket ID
        delete users[userId];
        io.emit('updateGuestList', Object.values(users)); // Ažuriraj listu gostiju
    });
});

// Pokreni server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server je pokrenut na portu ${PORT}`);
});
