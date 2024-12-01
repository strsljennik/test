const virtualGuests = [
    {
        nickname: 'Cuceklika',
        messages: [
            'Zdravo Sarinenge',
            'opaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa, ajmo💋 *__X__* 💋samo me em tu te kela'
        ],
        color: 'purple'
    },
    {
        nickname: 'Cuceklika',
        messages: [
            'Merava tuke *__X__* ❤️💋'
        ],
        color: 'purple'
    }
];

function sendMessageToChat(guest, message) {
    const messageArea = document.getElementById('messageArea');

    const messageElement = document.createElement('div');
    messageElement.innerHTML = `<span style="color: ${guest.color}; font-weight: bold; font-style: italic;">${guest.nickname}: ${message}</span>`;
    
    // Dodavanje poruke na vrh
    messageArea.insertBefore(messageElement, messageArea.firstChild);
    
    // Dodavanje razmaka između poruka
    const spacingElement = document.createElement('div');
    spacingElement.style.height = '20px'; // Podešavanje visine razmaka
    messageArea.insertBefore(spacingElement, messageArea.firstChild.nextSibling); // Razmak nakon poruke

    messageArea.scrollTop = 0; // Skrolovanje na vrh
}

function startVirtualGuests() {
    virtualGuests.forEach(guest => {
        let messageIndex = 0;

        const sendMessages = () => {
            if (messageIndex < guest.messages.length) {
                const message = guest.messages[messageIndex];
                sendMessageToChat(guest, message);
                
                messageIndex++;
                
                if (messageIndex < guest.messages.length) {
                    setTimeout(sendMessages, 15000); // Čekaj 15 sekundi pre slanja sledeće poruke
                }
            }
        };
        
        // Početak slanja poruka
        sendMessages();
    });

    // Pauza od 15 minuta (900000 milisekundi) pre ponovnog ciklusa
    setTimeout(startVirtualGuests, 900000);
}

// Pokretanje virtuelnih gostiju kada se stranica učita
window.onload = startVirtualGuests;
