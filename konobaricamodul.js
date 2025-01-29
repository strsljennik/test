module.exports = (io) => {
    let chatContainerState = { x: 0, y: 0, width: 900, height: 600 };
    let virtualGuests = []; // Lista virtuelnih gostiju

    io.on('connection', (socket) => {
        console.log('A user connected: ' + socket.id);

        socket.emit('updateChatContainer', { ...chatContainerState });

        socket.on('new_guest', () => {
            const greetingMessage = `Dobro nam došli, osećajte se kao kod kuće, i budite nam raspoloženi! Sada će vam vaša Konobarica posluziti kaficu ☕, 
                                    a naši DJ-evi će se pobrinuti da vam ispune muzičke želje.`;
            io.emit('message', { 
                username: '<span class="konabarica">Konobarica</span>', 
                message: greetingMessage,
                isSystemMessage: true 
            });
            socket.emit('updateChatContainer', { ...chatContainerState });
        });

        socket.on('moveChatContainer', (data) => {
            if (typeof data.x === 'number' && typeof data.y === 'number') {
                chatContainerState.x = data.x;
                chatContainerState.y = data.y;
                io.emit('updateChatContainer', { ...chatContainerState });
            }
        });

        socket.on('resizeChatContainer', (data) => {
            if (typeof data.width === 'number' && typeof data.height === 'number' && data.width > 50 && data.height > 50) {
                chatContainerState.width = data.width;
                chatContainerState.height = data.height;
                io.emit('updateChatContainer', { ...chatContainerState });
            }
        });

        // Dodavanje virtuelnih gostiju
        socket.on('addVirtualGuests', (guests) => {
            virtualGuests = guests; // Ažuriraj listu virtuelnih gostiju
            io.emit('updateVirtualGuests', virtualGuests); // Pošaljite svim korisnicima
        });

        // Uklanjanje virtuelnih gostiju
        socket.on('removeVirtualGuests', () => {
            virtualGuests = []; // Očisti listu virtuelnih gostiju
            io.emit('updateVirtualGuests', virtualGuests); // Pošaljite svim korisnicima
        });

        // Pošaljite trenutnu listu virtuelnih gostiju kada se korisnik poveže
        socket.emit('updateVirtualGuests', virtualGuests);

        socket.on('disconnect', () => {
            console.log('User disconnected: ' + socket.id);
        });
    });
};
