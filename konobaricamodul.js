module.exports = (io) => {
    let chatContainerPosition = { x: 0, y: 0 }; // Početna pozicija chat kontejnera

    io.on('connection', (socket) => {
        console.log('A user connected: ' + socket.id);

        // Kada novi gost uđe, šaljemo mu pozdravnu poruku od Konobarice
        socket.on('new_guest', () => {
            const greetingMessage = `Dobro nam došli, osećajte se kao kod kuće, i budite nam raspoloženi! Sada će vam vaša Konobarica posluziti kaficu ☕, 
                                    a naši DJ-evi će se pobrinuti da vam ispune muzičke želje.`;

            // Emitujemo pozdravnu poruku svima
            io.emit('message', { 
                username: '<span class="konabarica">Konobarica</span>', 
                message: greetingMessage,
                isSystemMessage: true // označavamo kao sistemsku poruku
            });

            // Šaljemo trenutnu poziciju chat kontejnera novom korisniku
            socket.emit('updateChatContainer', chatContainerPosition);
        });

        // Kada se korisnik poveže, šaljemo mu trenutnu poziciju chat kontejnera (u slučaju da se ne aktivira 'new_guest')
        socket.emit('updateChatContainer', chatContainerPosition);

        // Kada klijent pošalje poziciju chat kontejnera
        socket.on('moveChatContainer', (data) => {
            chatContainerPosition = data; // Ažuriraj poziciju chat kontejnera
            io.emit('updateChatContainer', chatContainerPosition); // Emitujemo svima
        });

        socket.on('disconnect', () => {
            console.log('User disconnected: ' + socket.id);
        });
    });
};
