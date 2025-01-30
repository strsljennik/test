module.exports = (io) => {
   let chatContainerState = { x: 0, y: 0, width: 900, height: 600 };

    io.on('connection', (socket) => {
        console.log('A user connected: ' + socket.id);

  socket.on('versionLoaded', (data) => {
    // Obavesti sve povezane korisnike
    io.emit('versionLoaded', data);
});

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

// Emisija za ažuriranje odmah nakon konekcije, pošto možda želiš da odmah pošalješ trenutnu veličinu
socket.emit('updateChatContainer', { ...chatContainerState });

socket.on('disconnect', () => {
    console.log('User disconnected: ' + socket.id);
       });
    });
};
