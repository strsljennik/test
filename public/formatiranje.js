const socket = io();

let isBold = false;
let isItalic = false;
let currentColor = '#FFFFFF';

// Funkcija za BOLD formatiranje
document.getElementById('boldBtn').addEventListener('click', function() {
    isBold = !isBold;
    updateInputStyle();
});

// Funkcija za ITALIC formatiranje
document.getElementById('italicBtn').addEventListener('click', function() {
    isItalic = !isItalic;
    updateInputStyle();
});

// Funkcija za biranje boje
document.getElementById('colorBtn').addEventListener('click', function() {
    document.getElementById('colorPicker').click();
});

// Kada korisnik izabere boju iz palete
document.getElementById('colorPicker').addEventListener('input', function() {
    currentColor = this.value;
    updateInputStyle();
});

// Primena stilova na polju za unos
function updateInputStyle() {
    let inputField = document.getElementById('chatInput');
    inputField.style.fontWeight = isBold ? 'bold' : 'normal';
    inputField.style.fontStyle = isItalic ? 'italic' : 'normal';
    inputField.style.color = currentColor;
}

// Kada korisnik pritisne Enter
document.getElementById('chatInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        let message = this.value;
        socket.emit('chatMessage', {
            text: message,
            bold: isBold,
            italic: isItalic,
            color: currentColor
        });
        this.value = ''; // Isprazni polje za unos
    }
});

// Kada server pošalje poruku
socket.on('chatMessage', function(data) {
    let messageArea = document.getElementById('messageArea');
    let newMessage = document.createElement('div');
    newMessage.classList.add('message');
    newMessage.style.fontWeight = data.bold ? 'bold' : 'normal';
    newMessage.style.fontStyle = data.italic ? 'italic' : 'normal';
    newMessage.style.color = data.color;
    newMessage.innerHTML = `<strong>${data.nickname}:</strong> ${data.text} <span style="font-size: 0.8em; color: gray;">(${data.time})</span>`;
    messageArea.prepend(newMessage);
    messageArea.scrollTop = 0; // Automatsko skrolovanje
});


// Kada nov gost dođe
socket.on('newGuest', function (nickname) {
    const guestList = document.getElementById('guestList');
    const newGuest = document.createElement('div');
    newGuest.textContent = nickname;
    // Dodaj novog gosta ispod DJ-a
    guestList.appendChild(newGuest);
});

// Ažuriranje liste gostiju
socket.on('updateGuestList', function (users) {
    const guestList = document.getElementById('guestList');
    guestList.innerHTML = ''; // Očisti trenutnu listu
    // Ponovo dodaj DJ-a
    const dj = document.createElement('div');
    dj.className = 'guest';
    dj.id = 'djNickname';
    dj.textContent = 'Radio Galaksija';
    guestList.appendChild(dj);
    
    // Dodaj ostale goste
    users.forEach(user => {
        const newGuest = document.createElement('div');
        newGuest.className = 'guest';
        newGuest.textContent = user;
        guestList.appendChild(newGuest);
    });
});

// Funkcija za brisanje chata
function deleteChat() {
    const messageArea = document.getElementById('messageArea');
    messageArea.innerHTML = ''; // Očisti sve poruke
    alert('Chat je obrisan.'); // Obaveštenje korisniku
}

// Osluškivanje klika na dugme "D"
document.getElementById('openModal').onclick = function() {
    deleteChat(); // Pozivamo funkciju za brisanje chata
};

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('banButton').onclick = function() {
        const password = prompt('Unesite lozinku za baniranje:');
        if (password === 'galaksija123') {
            alert('Pristup za baniranje odobren. Dvostruki klik na ime ili broj korisnika da biste ih banirali.');
            enableBanMode(); // Aktiviramo režim baniranja
        } else {
            alert('Pogrešna lozinka!');
        }
    };

    // Aktivacija ban režima
    function enableBanMode() {
        const guests = document.querySelectorAll('.guest'); // Pronađi sve elemente sa klasom 'guest'
        guests.forEach(guest => {
            guest.ondblclick = function() {
                const username = this.textContent; // Uzimamo ime korisnika
                const confirmBan = confirm(`Da li želite da banirate korisnika: ${username}?`);
                if (confirmBan) {
                    banUser(this); // Pozivamo funkciju za baniranje
                }
            };
        });
    }

    // Funkcija za baniranje korisnika
    function banUser(guestElement) {
        guestElement.style.textDecoration = 'line-through'; // Crvena linija preko korisnika
        guestElement.style.color = 'red'; // Promeni boju korisnika na crveno
        guestElement.style.pointerEvents = 'none'; // Onemogući dalji unos
        alert(`${guestElement.textContent} je baniran i više ne može da piše na chat.`);
    }
});
