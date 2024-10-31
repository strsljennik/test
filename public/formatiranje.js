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
    currentColor = this.value; // Uzimanje izabrane boje
    updateInputStyle(); // Ažuriranje stilova unosa
});

// Funkcija za ažuriranje boje u input polju
function updateInputStyle() {
    let inputField = document.getElementById('chatInput');
    inputField.style.fontWeight = isBold ? 'bold' : 'normal';
    inputField.style.fontStyle = isItalic ? 'italic' : 'normal';
    inputField.style.color = currentColor; // Update to current text color
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
    newMessage.style.color = data.color; // Koristi boju iz poruke
    newMessage.innerHTML = `<strong>${data.nickname}:</strong> ${data.text} <span style="font-size: 0.8em; color: gray;">(${data.time})</span>`;
    messageArea.prepend(newMessage);
    messageArea.scrollTop = 0; // Automatsko skrolovanje
});

// Kada nov gost dođe
socket.on('newGuest', function (nickname) {
    const guestList = document.getElementById('guestList');
    const newGuest = document.createElement('div');
    newGuest.className = 'guest'; // Dodaj klasu za stil
    newGuest.style.color = currentColor; // Postavi boju samo za novog gosta
    newGuest.textContent = nickname;
    guestList.appendChild(newGuest);
});
  // Dodaj ostale goste
    users.forEach(user => {
        const newGuest = document.createElement('div');
        newGuest.className = 'guest';
        newGuest.style.color = currentColor; // Postavi boju samo za novog gosta
        newGuest.textContent = user;
        guestList.appendChild(newGuest);
    });
});
