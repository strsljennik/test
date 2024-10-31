const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// HTML kod koji će se prikazati na klijentskoj strani
const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Radio Chat</title>
    <style>
        body { font-family: Arial, sans-serif; }
        #chat-box { width: 80%; height: 300px; border: 1px solid #000; overflow-y: auto; margin-bottom: 20px; }
        #clear-chat-btn { display: none; padding: 10px; background-color: red; color: white; border: none; cursor: pointer; }
        #stats { font-size: 14px; margin-bottom: 10px; }
    </style>
</head>
<body>
    <div id="stats">Broj gostiju: 0 | Vreme: <span id="time">--:--:--</span></div>
    <div id="chat-box"></div>
    <button id="clear-chat-btn" onclick="clearChat()">CLEAR</button>

    <script src="/socket.io/socket.io.js"></script>
    <script>
        const socket = io();
        let keySequence = "";

        // Prati broj gostiju i ažuriraj prikaz
        socket.on("updateGuests", (guestCount) => {
            document.getElementById("stats").textContent = "Broj gostiju: " + guestCount;
        });

        // Ažuriraj vreme svakih sekundu
        setInterval(() => {
            const now = new Date();
            document.getElementById("time").textContent = now.toLocaleTimeString();
        }, 1000);

        // Prikazuje dugme CLEAR kada se unese "AAA"
        document.addEventListener("keydown", function(event) {
            keySequence += event.key.toLowerCase();

            if (keySequence.includes("aaa")) {
                document.getElementById("clear-chat-btn").style.display = "inline";
                keySequence = ""; // Resetuje sekvencu nakon prikaza dugmeta
            }
            
            if (keySequence.length > 3) {
                keySequence = keySequence.slice(-3);
            }
        });

        // Funkcija za brisanje čata
        function clearChat() {
            socket.emit("clearChatForAll");
            document.getElementById("clear-chat-btn").style.display = "none"; // Sakrije dugme nakon klika
        }

        // Prima događaj za brisanje čata od servera
        socket.on("clearChat", () => {
            document.getElementById("chat-box").innerHTML = "";
        });
    </script>
</body>
</html>
`;

// Posluži HTML kod
app.get("/", (req, res) => {
    res.send(htmlContent);
});

// Praćenje broja konektovanih gostiju
let guestCount = 0;

io.on("connection", (socket) => {
    guestCount++;
    io.emit("updateGuests", guestCount); // Ažurira broj gostiju za sve

    // Reaguje na događaj clearChatForAll i šalje svim korisnicima da obrišu čat
    socket.on("clearChatForAll", () => {
        io.emit("clearChat");
    });

    // Smanjuje broj gostiju kad neko izađe
    socket.on("disconnect", () => {
        guestCount--;
        io.emit("updateGuests", guestCount);
    });
});

// Pokrećemo server na portu 3000
server.listen(3000, () => {
    console.log("Server je pokrenut na http://localhost:3000");
});
