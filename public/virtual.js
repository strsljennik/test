const virtualGuests = [
    { nickname: 'Cuceklika 1', message: 'Pozdrav svima!', color: 'skyblue' },
    { nickname: 'Cuceklika 1', message: 'jasaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', color: 'skyblue' },
    { nickname: 'Cuceklika 2', message: 'Zdravo Sarinenge', color: 'purple' },
    { nickname: 'Cuceklika 2', message: 'opaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', color: 'purple' },
    { nickname: 'Cuceklika 3', message: 'Selami sarinenge', color: 'red' },
    { nickname: 'Cuceklika 3', message: 'tooooooooooooooooooooooooooooooooooooooooooo', color: 'red' },
    { nickname: 'Cuceklika 1', message: '*__X__* Mangava tu ❤️', color: 'skyblue' },
    { nickname: 'Cuceklika 2', message: 'Nas olestar cuceklike 1, Merava tuke *__X__* ❤️💋', color: 'purple' },
    { nickname: 'Cuceklika 3', message: 'Dzabe tumen cupinen pe taro bala OV TANO SAMO MLO', color: 'red' }
];

function sendMessageToChat(guest) {
    const messageArea = document.getElementById('messageArea');

    const messageElement = document.createElement('div');
    messageElement.innerHTML = `<span style="color: ${guest.color}; font-weight: bold; font-style: italic;">${guest.nickname}: ${guest.message}</span>`;
    
    messageArea.prepend(messageElement); // Koristi prepend za dodavanje novih poruka na vrh

    // Dodavanje razmaka između poruka
    const spacingElement = document.createElement('div');
    spacingElement.style.height = '10px'; // Podešavanje visine razmaka
    messageArea.prepend(spacingElement); // Koristi prepend za razmak

    messageArea.scrollTop = 0; // Pomeri na vrh
}

function addGuestToList(guest) {
    const guestList = document.getElementById('guestList');

    // Proveri da li gost već postoji u listi
    if (!Array.from(guestList.children).some(el => el.textContent.includes(guest.nickname))) {
        const guestElement = document.createElement('div');
        guestElement.classList.add('guest');
        guestElement.innerHTML = `<span style="color: ${guest.color}; font-weight: bold; font-style: italic;">${guest.nickname}</span>`; // Prikazivanje boje i stila

        guestList.appendChild(guestElement);
    }
}

function startVirtualGuests() {
    let index = 0;

    // Slanje poruka u intervalima koje si definisao
    const intervals = [0, 5, 60, 65, 120, 125, 180, 200, 220]; // U sekundama
    const messagesInterval = setInterval(() => {
        if (index < virtualGuests.length) {
            const currentTime = intervals[index];

            setTimeout(() => {
                sendMessageToChat(virtualGuests[index]);
                addGuestToList(virtualGuests[index]); // Dodavanje gosta u listu
                index++;
            }, currentTime * 1000); // Konvertuj u milisekunde

        } else {
            clearInterval(messagesInterval); // Zaustavi interval kada su sve poruke poslate
            index = 0; // Resetuj index za ponavljanje
            setTimeout(startVirtualGuests, 240000); // Pauza od 240 sekundi pre ponovnog slanja
        }
    }, 1000); // Uvek se poziva svake sekunde za kontrolu
}

// Pokretanje virtuelnih gostiju kada se stranica učita
window.onload = startVirtualGuests;
