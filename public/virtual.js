const virtualGuest = [
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



const virtualGuests = [
   
    { nickname: 'Sanja', messages: [ 'Romalen jasaaaaaaaaaaaaaaaaaaaaaaaaaaa!'], color: 'violet' },
    { nickname: 'Bojan', messages: ['Poz svima , no pc'], color: 'lime' },
    { nickname: 'Gost-7721', messages: ['Jaaaaaaaaaaaaasaaaaaaaaaaaaaaaaaaaaaaaaaaa!'], color: 'white' },
    { nickname: '°Sladja°', messages: ['Romalen jasaaaaaaaaaaaaaaaaaaaaaaaaaaa!'], color: 'magenta' },
   { nickname: 'Gost-5582', messages: [' Opaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!'], color: 'white' },
    { nickname: 'Boxer', messages: [''], color: 'braun' },
    { nickname: 'Gost-8644', messages: [''], color: 'white' },
    { nickname: '<<Kristina>>', messages: [''], color: 'pink' },
    { nickname: '/Sanella/', messages: [''], color: 'red' },
    
];

function sendMessageToChat(guest, message) {
    const messageArea = document.getElementById('messageArea');

    const messageElement = document.createElement('div');
    messageElement.innerHTML = `<span style="color: ${guest.color}; font-weight: bold; font-style: italic;">${guest.nickname}: ${message}</span>`;
    
    messageArea.insertBefore(messageElement, messageArea.firstChild);

    const spacingElement = document.createElement('div');
    spacingElement.style.height = '10px';
    messageArea.insertBefore(spacingElement, messageArea.firstChild.nextSibling);

    messageArea.scrollTop = 0;
}

function addGuestsToList() {
    const guestList = document.getElementById('guestList');
    
    virtualGuests.forEach(guest => {
        if (!Array.from(guestList.children).some(el => el.textContent === guest.nickname)) {
            const guestElement = document.createElement('div');
            guestElement.classList.add('guest');
            guestElement.textContent = guest.nickname;
            guestElement.style.color = guest.color;
            guestElement.style.fontWeight = 'bold';
            guestElement.style.fontStyle = 'italic';

            guestList.appendChild(guestElement);
        }
    });
}

function startVirtualGuests() {
    virtualGuests.forEach((guest, index) => {
        setTimeout(() => {
            guest.messages.forEach((message, msgIndex) => {
                setTimeout(() => {
                    sendMessageToChat(guest, message);
                }, msgIndex * 300000); // 5 minuta razmaka između poruka
            });
        }, index * 300000); // 5 minuta razmaka između gostiju
    });

    setTimeout(startVirtualGuests, virtualGuests.length * 300000);
}

window.onload = () => {
    addGuestsToList();
    startVirtualGuests();
};


// Pokretanje virtuelnih gostiju kada se stranica učita
window.onload = startVirtualGuests;
