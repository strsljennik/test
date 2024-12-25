const virtualGuests = [
    { nickname: 'cuceklika 1', messages: ['Poz Svima', 'jasaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'], color: 'deepskyblue' },
    { nickname: 'cuceklika 2', messages: ['Zdravo Sarinenge', 'opaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'], color: 'purple' },
    { nickname: 'cuceklika 3', messages: ['Selami sarinenge', 'tooOOOOOOOOOOOOOOOOOOOOOOO'], color: 'red' },
    { nickname: 'cuceklika 1', messages: ['*__X__* Mangava tu ❤️'], color: 'deepskyblue' },
    { nickname: 'cuceklika 2', messages: ['Nas olestar cuceklike 1, Merava tuke *__X__* ❤️💋'], color: 'purple' },
    { nickname: 'cuceklika 3', messages: ['Dzabe tumen cupinen pe taro bala OV TANO SAMO MLO'], color: 'red' },
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

function addGuestToList(guest) {
    const guestList = document.getElementById('guestList');
    
    const guestElement = document.createElement('div');
    guestElement.classList.add('guest');
    guestElement.textContent = guest.nickname;
    guestElement.style.color = guest.color;

    guestList.appendChild(guestElement);
}

function startVirtualGuests() {
    // Dodaj sve goste odmah u listu
    virtualGuests.forEach(guest => addGuestToList(guest));

    const messageTimings = [
        { guestIndex: 0, messageIndex: 0, time: 0 },    
        { guestIndex: 0, messageIndex: 1, time: 5 },    
        { guestIndex: 1, messageIndex: 0, time: 60 },   
        { guestIndex: 1, messageIndex: 1, time: 65 },   
        { guestIndex: 2, messageIndex: 0, time: 120 },  
        { guestIndex: 2, messageIndex: 1, time: 125 },  
        { guestIndex: 0, messageIndex: 0, time: 180 },  
        { guestIndex: 1, messageIndex: 1, time: 200 },  
        { guestIndex: 2, messageIndex: 1, time: 220 },  
    ];

    messageTimings.forEach(({ guestIndex, messageIndex, time }) => {
        setTimeout(() => {
            sendMessageToChat(virtualGuests[guestIndex], virtualGuests[guestIndex].messages[messageIndex]);
        }, time * 1000);
    });

    setTimeout(startVirtualGuests, 240 * 1000);
}

window.onload = startVirtualGuests;
