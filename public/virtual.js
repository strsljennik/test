const virtualGuests = [
    { nickname: 'cuceklika 1', message: 'Pozdrav svima!', color: 'red' },
    { nickname: 'cuceklika 2', message: 'Jasaaaaaaaaa!', color: 'purple' },
    { nickname: 'cuceklika 3', message: 'Opaaaaaaaaa!', color: 'pink' }
];

function sendMessageToChat(guest) {
    const messageArea = document.getElementById('messageArea');

    const messageElement = document.createElement('div');
    messageElement.innerHTML = `<span style="color: ${guest.color}; font-weight: bold; font-style: italic;">${guest.nickname}: ${guest.message}</span>`;

    // Umetni novu poruku na vrh chat prozora
    messageArea.insertBefore(messageElement, messageArea.firstChild);
    
    // Dodavanje razmaka između poruka
    const spacingElement = document.createElement('div');
    spacingElement.style.height = '10px'; // Podešavanje visine razmaka
    messageArea.insertBefore(spacingElement, messageArea.firstChild);
}

function addGuestToList(guest) {
    const guestList = document.getElementById('guestList');

    // Proveri da li gost već postoji u listi
    if (!Array.from(guestList.children).some(el => el.textContent === guest.nickname)) {
        const guestElement = document.createElement('div');
        guestElement.classList.add('guest');
        guestElement.textContent = guest.nickname;

        guestList.appendChild(guestElement);
    }
}

function startVirtualGuests() {
    let index = 0;

    // Učitavanje prvih poruka odmah
    addGuestToList(virtualGuests[index]);
    sendMessageToChat(virtualGuests[index]);
    index++;

    // Slanje poruka u intervalima od 2 minuta
    setInterval(() => {
        if (index < virtualGuests.length) {
            sendMessageToChat(virtualGuests[index]);
            addGuestToList(virtualGuests[index]);
            index++;
        } else {
            index = 0; // Vraća se na početak
        }
    }, 120000); // 2 minuta u milisekundama
}

// Pokretanje virtuelnih gostiju kada se stranica učita
window.onload = startVirtualGuests;
