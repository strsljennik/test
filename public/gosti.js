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
    { nickname: 'Gost-4756', messages: [''], color: 'gray' },
    { nickname: 'Gost-4829', messages: ['Poz sarjenge'], color: 'white' },
    { nickname: 'Gost-4912', messages: ['Sare soven , usten te kelen ari'], color: 'white' },
    { nickname: 'King', messages: [''], color: 'gold' },
    { nickname: 'Gost-5001', messages: [''], color: 'white' },
    { nickname: 'Gost-5132', messages: [''], color: 'white' },
    { nickname: 'Gost-5254', messages: [''], color: 'white' },
    { nickname: 'LJubisa', messages: [''], color: 'black' },
    { nickname: 'Gost-5389', messages: [''], color: 'white' },
    { nickname: 'Gost-5510', messages: ['Slušam muziku.'], color: 'white' },
    { nickname: 'Gost-5673', messages: ['toooooooooooooooooooooooooooooooooooooooooooooo'], color: 'white' },
    { nickname: 'Gost-5785', messages: [''], color: 'aqua' },
    { nickname: 'Alexandra', messages: [''], color: 'blue' },
    { nickname: 'Gost-5932', messages: [''], color: 'white' },
    { nickname: 'Gost-6054', messages: ['jasaaaaaaaa jasaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'], color: 'white' },
    { nickname: 'Gost-6178', messages: [''], color: 'white' },
    { nickname: 'Gost-6299', messages: ['Dobar dan svima!'], color: 'green' },
    { nickname: 'Bojana', messages: [''], color: 'purple' },
    { nickname: 'Gost-6450', messages: ['Vikend vibe.'], color: 'white' },
    { nickname: 'Gost-6574', messages: ['jasaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'], color: 'white' },
    { nickname: 'Mellisa', messages: ['toooooooooooooooooooooooooooooooooooooo!'], color: 'yellow' },
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
