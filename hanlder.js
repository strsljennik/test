// socketHandlers.js

const setupSocketHandlers = (io) => {
    const users = {}; // Čuva sve korisnike

    io.on('connection', (socket) => {
        const userId = socket.id; // Dodeljujemo korisniku jedinstveni ID

        console.log('Novi korisnik je povezan');

        // Kada se korisnik prijavi
        socket.on('userLoggedIn', (username) => {
            // Ako je korisnik Radio Galaksija, dodeljujemo mu posebne stilove
            if (username === 'Radio Galaksija') {
                users[userId] = {
                    nickname: username,
                    styles: {
                        bold: true,
                        italic: true,
                        color: 'yellow'
                    }
                };
            } else {
                // Ostali korisnici dobijaju standardne stilove
                users[userId] = {
                    nickname: username,
                    styles: {
                        bold: false,
                        italic: false,
                        color: 'black'
                    }
                };
            }

            // Emituj ažuriranu listu
            updateGuestList();
        });

        // Funkcija za ažuriranje liste gostiju
        const updateGuestList = () => {
            io.emit('updateGuestList', Object.values(users)); // Emituj sve korisnike
        };

        // Ažuriranje stila korisnika
        socket.on('updateStyle', (newStyles) => {
            if (users[userId]) {
                users[userId].styles = { ...users[userId].styles, ...newStyles }; // Ažuriraj samo promene
            }
            updateGuestList(); // Ažuriraj listu nakon promene stila
        });

        // Kada se korisnik odjavi
        socket.on('disconnect', () => {
            console.log(`Korisnik ${users[userId].nickname} se odjavio.`);
            delete users[userId]; // Ukloni korisnika iz liste
            updateGuestList(); // Ažuriraj listu nakon odjave
        });
    });
};

// Exportuj funkciju za postavljanje socket handler-a
module.exports = setupSocketHandlers;
