const moment = require('moment-timezone');
const lastMessages = {}; // Objekat za čuvanje poslednjih poruka
const userFormatting = {}; // Objekat za čuvanje opcija formatiranja korisnika

// Funkcija za obezbeđivanje da 'Radio Galaksija' bude na vrhu liste gostiju
function ensureRadioGalaksijaAtTop(guests) {
    const guestList = Object.values(guests);
    if (guestList.includes('Radio Galaksija')) {
        const index = guestList.indexOf('Radio Galaksija');
        guestList.splice(index, 1); // Ukloni ga iz trenutnog mesta
        guestList.unshift('Radio Galaksija'); // Dodaj ga na vrh
    }
    return guestList;
}

// Funkcija za primenu formatiranja
function applyFormatting(userId, message) {
    const formatting = userFormatting[userId] || {};

    if (formatting.underline) {
        message = `<u>${message}</u>`;
    }
    if (formatting.overline) {
        message = `<span style="text-decoration: overline;">${message}</span>`;
    }

    return message;
}

// Funkcija koja se poziva prilikom slanja poruka
function handleChatMessage(io, socket, msgData) {
    const userId = socket.id;

    // Ignoriši ako je poruka identična
    if (lastMessages[userId] === msgData.text) return;
    lastMessages[userId] = msgData.text; // Sačuvaj novu poruku

    // Obrada #l ili #L komande za uključivanje/isključivanje underline
    if (msgData.text.trim().toLowerCase() === '#l') {
        userFormatting[userId] = {
            ...userFormatting[userId],
            underline: !userFormatting[userId]?.underline,
        };
        return;
    }

    // Obrada #u ili #U komande za uključivanje/isključivanje overline
    if (msgData.text.trim().toLowerCase() === '#u') {
        userFormatting[userId] = {
            ...userFormatting[userId],
            overline: !userFormatting[userId]?.overline,
        };
        return;
    }

    // Obrada #n komande
    if (msgData.text.includes('#n')) {
        const nickname = getNickname(socket.id); // Pretpostavljamo da funkcija getNickname postoji
        const message = `${nickname} CITA POZ ${nickname}`;
        io.emit('chatMessage', message);
    }

    // Formatiraj i emituj poruku
    const formattedMessage = applyFormatting(userId, msgData.text);
    io.emit('chatMessage', formattedMessage);

    // Dupliranje poruke ako završava sa #
    if (msgData.text.endsWith('#')) {
        const duplicateMessage = msgData.text.slice(0, -1); // Ukloni #
        const formattedDuplicateMessage = applyFormatting(userId, duplicateMessage);
        io.emit('chatMessage', formattedDuplicateMessage); // Emituj duplu poruku
    }

    // Ako korisnik pošalje #g
    if (msgData.text.trim() === '#g') {
        const berlinTime = moment().tz('Europe/Berlin').format('YYYY-MM-DD HH:mm:ss'); // Formatira vreme
        const timeMessage = `Vreme u Berlinu: ${berlinTime}`;
        io.emit('chatMessage', timeMessage); // Emituj vreme u berlinskoj zoni
    }
}

module.exports = {
    ensureRadioGalaksijaAtTop,
    handleChatMessage,
};
