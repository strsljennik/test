const bannedUsers = new Set(); // Čuvamo banovane korisnike

// Lista ovlašćenih korisnika za banovanje i unbanovanje
const authorizedUsers = new Set(['Radio Galaksija', 'ZI ZU', '__X__']);

const banUser = (io, socket, userIdToBan) => {
    if (!authorizedUsers.has(socket.username)) {
        socket.emit('error', 'Nemate ovlašćenje za banovanje korisnika.');
        return;
    }
    if (!bannedUsers.has(userIdToBan)) {
        bannedUsers.add(userIdToBan);
        io.emit('userBanned', userIdToBan);
        console.log(`Korisnik ${userIdToBan} je banovan od strane ${socket.username}.`);
    }
};

const unbanUser = (io, socket, userIdToUnban) => {
    if (!authorizedUsers.has(socket.username)) {
        socket.emit('error', 'Nemate ovlašćenje za odbanovanje korisnika.');
        return;
    }
    if (bannedUsers.has(userIdToUnban)) {
        bannedUsers.delete(userIdToUnban);
        io.emit('userUnbanned', userIdToUnban);
        console.log(`Korisnik ${userIdToUnban} je oslobođen od strane ${socket.username}.`);
    }
};

const setupSocketEvents = (io) => {
    io.on('connection', (socket) => {
        // Dodela imena korisniku pri povezivanju, npr. 'Radio Galaksija', 'ZI ZU', itd.
        socket.username = socket.handshake.query.username;

        // Banovanje korisnika
        socket.on('banUser', (userIdToBan) => banUser(io, socket, userIdToBan));

        // Oslobađanje korisnika
        socket.on('unbanUser', (userIdToUnban) => unbanUser(io, socket, userIdToUnban));

        // Poruka
        socket.on('message', (msg) => {
            if (!bannedUsers.has(socket.id)) {
                io.emit('message', { userId: socket.id, msg });
            }
        });
    });
};

module.exports = {
    setupSocketEvents,
    bannedUsers
};
