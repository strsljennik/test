// Kada se povežemo sa serverom, emitujemo događaj za novog gosta
socket.emit('new_guest');

// Slušamo za poruke od servera, u ovom slučaju pozdravnu poruku od konobarice
socket.on('message', (data) => {
    const messageArea = document.getElementById('messageArea');
    
    // Kreiramo HTML element za poruku
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    
    // Dodajemo korisničko ime i poruku
    messageElement.innerHTML = `
        <strong>${data.username}:</strong> ${data.message}
    `;
    
    // Ako je sistemska poruka, dodajemo odgovarajući stil
    if (data.isSystemMessage) {
        messageElement.classList.add('system-message');
    }
    
    // Dodajemo poruku u area poruka
    messageArea.appendChild(messageElement);
    
    // Skrolujemo na poslednju poruku
    messageArea.scrollTop = messageArea.scrollHeight;
});

// Kada se konobarica poveže, dodajemo je u listu gostiju
socket.on('add_conobarica', () => {
    const guestList = document.getElementById('guestList'); // Pretpostavljamo da imaš listu gostiju u HTML-u
    const conobaricaItem = document.createElement('li');
    
    // Dodajemo Konobaricu sa klasom 'guest-konobarica'
    conobaricaItem.classList.add('guest-konobarica');
    conobaricaItem.innerHTML = 'Konobarica'; // Dodajemo samo tekst bez tagova
    
    // Dodajemo je u sredinu liste
    const guests = guestList.getElementsByTagName('li');
    const middleIndex = Math.floor(guests.length / 2);
    guestList.insertBefore(conobaricaItem, guests[middleIndex]);

    // Skrolujemo listu ako je potrebno
    guestList.scrollTop = guestList.scrollHeight;
});
