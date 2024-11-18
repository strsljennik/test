io.on('connection', (socket) => {
    const users = loadUserData();  // Učitaj sve korisnike
    const uniqueNumber = generateUniqueNumber();  // Koristi funkciju za generisanje broja
    const username = `Gost-${uniqueNumber}`;
    const userColor = '#FF0000';  // Početna boja (možeš promeniti)

    // Dodaj korisnika u goste sa svim podacima
    guests[socket.id] = { username, color: userColor };
    saveUserData(username, userColor);  // Spremi novog korisnika u JSON fajl

    console.log(`${username} se povezao sa bojom ${userColor}.`);

    socket.broadcast.emit('newGuest', username);
    io.emit('updateGuestList', Object.values(guests));

    // Provera da li je korisnik ovlašćen
    socket.on('userLoggedIn', (username) => {
        if (authorizedUsers.has(username)) {
            guests[socket.id].username = `${username} (Admin)`;  // Ažuriraj objekat
            console.log(`${username} je autentifikovan kao admin.`);
        } else {
            guests[socket.id].username = username;  // Ažuriraj objekat
            console.log(`${username} se prijavio kao gost.`);
        }
        io.emit('updateGuestList', Object.values(guests));
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
        io.emit('chatMessage', messageToSend);
    });

    socket.on('changeColor', (newColor) => {
        guests[socket.id].color = newColor;
        updateUserColor(username, newColor);  // Ažuriraj boju u JSON fajlu
        io.emit('updateGuestList', Object.values(guests));
    });

    socket.on('disconnect', () => {
        console.log(`${guests[socket.id].username} se odjavio.`);
        assignedNumbers.delete(parseInt(guests[socket.id].username.split('-')[1], 10));
        delete guests[socket.id];
        io.emit('updateGuestList', Object.values(guests));
    });

    // Događaj za banovanje korisnika
    socket.on('banUser', (userIdToBan) => {
        if (!authorizedUsers.has(guests[socket.id].username.split(' ')[0])) {
            socket.emit('error', 'Nemate ovlašćenje za banovanje korisnika.');
            return;
        }
        if (!bannedUsers.has(userIdToBan)) {
            bannedUsers.add(userIdToBan);
            io.emit('userBanned', userIdToBan);
            console.log(`Korisnik ${userIdToBan} je banovan od strane ${guests[socket.id].username}.`);
        }
    });

    // Događaj za odbanovanje korisnika
    socket.on('unbanUser', (userIdToUnban) => {
        if (!authorizedUsers.has(guests[socket.id].username.split(' ')[0])) {
            socket.emit('error', 'Nemate ovlašćenje za odbanovanje korisnika.');
            return;
        }
        if (bannedUsers.has(userIdToUnban)) {
            bannedUsers.delete(userIdToUnban);
            io.emit('userUnbanned', userIdToUnban);
            console.log(`Korisnik ${userIdToUnban} je oslobođen od strane ${guests[socket.id].username}.`);
        }
    });
});
