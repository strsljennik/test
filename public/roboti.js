const defaultGuests = [
    { nickname: 'Sanja', messages: [ 'Romalen jasaaaaaaaaaaaaaaaaaaaaaaaaaaa!'], color: 'violet' },
    { nickname: 'Bojan', messages: ['Poz svima , no pc'], color: 'lime' },
    { nickname: 'Gost-7721', messages: ['Jaaaaaaaaaaaaasaaaaaaaaaaaaaaaaaaaaaaaaaaa!'], color: 'white' },
    { nickname: '°Sladja°', messages: ['Romalen jasaaaaaaaaaaaaaaaaaaaaaaaaaaa!'], color: 'magenta' },
    { nickname: 'Gost-5582', messages: [' Opaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!'], color: 'white' },
    { nickname: 'Boxer', messages: [''], color: 'braun' },
    { nickname: 'Gost-8644', messages: [''], color: 'white' },
    { nickname: '<<Kristina>>', messages: [''], color: 'pink' },
    { nickname: '/Sanella/', messages: [''], color: 'red' },
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

// Funkcija za slanje poruka u chat
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

// Funkcija za dodavanje gostiju u listu, bez duplikata
function addGuestsToList() {
    const guestList = document.getElementById('guestList');
    const storedGuests = JSON.parse(localStorage.getItem('virtualGuests')) || defaultGuests;

    // Filtriraj duplikate po nickname-u
    const uniqueGuests = storedGuests.filter((guest, index, self) => 
        index === self.findIndex((g) => (
            g.nickname === guest.nickname
        ))
    );

    // Dodaj samo jedinstvene goste u listu
    uniqueGuests.forEach(guest => {
        const guestElement = document.createElement('div');
        guestElement.classList.add('guest');
        guestElement.textContent = guest.nickname;
        guestElement.style.color = guest.color;
        guestElement.style.fontWeight = 'bold';
        guestElement.style.fontStyle = 'italic';

        guestList.appendChild(guestElement);
    });

    // Sačuvaj jedinstvene goste u localStorage
    localStorage.setItem('virtualGuests', JSON.stringify(uniqueGuests));
}

// Funkcija za pokretanje poruka gostiju
function startVirtualGuests() {
    const storedGuests = JSON.parse(localStorage.getItem('virtualGuests')) || defaultGuests;

    storedGuests.forEach((guest, index) => {
        setTimeout(() => {
            guest.messages.forEach((message, msgIndex) => {
                setTimeout(() => {
                    sendMessageToChat(guest, message);
                }, msgIndex * 300000); // 5 minuta razmaka između poruka
            });
        }, index * 300000); // 5 minuta razmaka između gostiju
    });

    setTimeout(startVirtualGuests, storedGuests.length * 300000);
}

// Pokretanje kodova pri učitavanju stranice
window.onload = () => {
    addGuestsToList();
    startVirtualGuests();
};
