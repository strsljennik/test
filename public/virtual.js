const virtualGuests = [
    { nickname: 'cuceklika 1', message: 'Pozdrav svima!', color: 'red' },
    { nickname: 'cuceklika 2', message: 'Jasaaaaaaaaa!', color: 'purple' },
    { nickname: 'cuceklika 3', message: 'Opaaaaaaaaa!', color: 'pink' }
];

function sendMessageToChat(guest) {
    const messageArea = document.getElementById('messageArea');

    const messageElement = document.createElement('div');
    messageElement.innerHTML = `<span style="color: ${guest.color}; font-weight: bold; font-style: italic;">${guest.nickname}: ${guest.message}</span>`;
    
    messageArea.appendChild(messageElement);
    
    // Dodavanje razmaka između poruka
    const spacingElement = document.createElement('div');
    spacingElement.style.height = '10px'; // Podešavanje visine razmaka
    messageArea.appendChild(spacingElement);


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

    // Odmah šalje prvu poruku i dodaje prvog gosta
    sendMessageToChat(virtualGuests[index]);
    addGuestToList(virtualGuests[index]);
    index++;

    // Slanje ostalih poruka u intervalima od 3 minuta
    setInterval(() => {
        if (index < virtualGuests.length) {
            sendMessageToChat(virtualGuests[index]);
            addGuestToList(virtualGuests[index]); // Dodavanje gosta u listu
            index++;
        } else {
            index = 0; // Vraća se na početak
        }
    }, 180000); // 3 minuta u milisekundama
}

// Pokretanje virtuelnih gostiju kada se stranica učita
window.onload = startVirtualGuests;
