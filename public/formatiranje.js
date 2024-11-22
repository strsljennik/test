const socket = io();

// UUID za korisnika
let userUUID = localStorage.getItem('userUUID');
if (!userUUID || !uuid.validate(userUUID)) { // Validacija UUID-a
    userUUID = uuid.v4();  // Generišemo novi UUID ako ne postoji
    localStorage.setItem('userUUID', userUUID); // Čuvamo UUID u localStorage
}

let isBold = true;
let isItalic = true;
let currentColor = '#FFFFFF';

// Objekat za čuvanje podataka o gostima
const guestsData = {};

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
        let message = this.value.trim(); // Uklonimo nepotrebne praznine
        if (message) { // Proveri da li je poruka prazna
            socket.emit('chatMessage', {
                text: message,
                bold: isBold,
                italic: isItalic,
                color: currentColor,
                uuid: userUUID  // Pošaljemo UUID sa porukom
            });
            this.value = ''; // Isprazni polje za unos
        }
    }
});

// Kada server pošalje poruku
socket.on('chatMessage', function(data) {
    let messageArea = document.getElementById('messageArea');
    const time = new Date().toLocaleTimeString(); // Dodavanje vremena poruke
    let newMessage = document.createElement('div');
    newMessage.classList.add('message');
    newMessage.style.fontWeight = data.bold ? 'bold' : 'normal';
    newMessage.style.fontStyle = data.italic ? 'italic' : 'normal';
    newMessage.style.color = data.color;
    newMessage.innerHTML = `<strong>${data.nickname}:</strong> ${data.text} <span style="font-size: 0.8em; color: gray;">(${time})</span>`;
    messageArea.prepend(newMessage);
    messageArea.scrollTop = 0; // Automatsko skrolovanje
});

// Funkcija za učitavanje podataka o gostima
function loadGuestData(guestId) {
    let guestData = localStorage.getItem(guestId);
    if (guestData) {
        return JSON.parse(guestData); // Učitaj podatke iz localStorage
    }
    return { color: '#000000', isBold: false, isItalic: false }; // Default vrednosti
}

// Funkcija za dodavanje stilova gostima
function addGuestStyles(guestElement, guestId) {
    const colorPickerButton = document.createElement('input');
    colorPickerButton.type = 'color';
    colorPickerButton.classList.add('colorPicker');
    
    // Učitavamo prethodne stilove ako postoje
    const guestData = loadGuestData(guestId);
    colorPickerButton.value = guestData.color || '#000000';
    
    colorPickerButton.addEventListener('input', function() {
        guestElement.style.color = this.value;
        guestsData[guestId].color = this.value; // Ažuriraj boju u objektu
        localStorage.setItem(guestId, JSON.stringify(guestsData[guestId]));  // Spasi u localStorage
    });

    const boldButton = document.createElement('button');
    boldButton.textContent = 'B';
    boldButton.addEventListener('click', function() {
        guestsData[guestId].isBold = !guestsData[guestId].isBold;
        guestElement.style.fontWeight = guestsData[guestId].isBold ? 'bold' : 'normal';
        localStorage.setItem(guestId, JSON.stringify(guestsData[guestId]));  // Spasi u localStorage
    });

    const italicButton = document.createElement('button');
    italicButton.textContent = 'I';
    italicButton.addEventListener('click', function() {
        guestsData[guestId].isItalic = !guestsData[guestId].isItalic;
        guestElement.style.fontStyle = guestsData[guestId].isItalic ? 'italic' : 'normal';
        localStorage.setItem(guestId, JSON.stringify(guestsData[guestId]));  // Spasi u localStorage
    });

    guestElement.appendChild(colorPickerButton);
    guestElement.appendChild(boldButton);
    guestElement.appendChild(italicButton);
}

// Kada nov gost dođe
socket.on('newGuest', function(nickname) {
    const guestId = `guest-${nickname}`;
    const guestList = document.getElementById('guestList');
    const newGuest = document.createElement('div');
    newGuest.classList.add('guest');
    
    // Prikazivanje imena gosta umesto objekta
    newGuest.textContent = nickname; // Prikazujemo nickname kao string

    // Učitaj postojeće stilove
    const guestData = loadGuestData(guestId);
    newGuest.style.color = guestData.color;
    newGuest.style.fontWeight = guestData.isBold ? 'bold' : 'normal';
    newGuest.style.fontStyle = guestData.isItalic ? 'italic' : 'normal';

    addGuestStyles(newGuest, guestId); // Dodaj stilove
    guestList.appendChild(newGuest); // Dodaj novog gosta
});

// Ažuriranje liste gostiju bez resetovanja stilova
socket.on('updateGuestList', function(users) {
    const guestList = document.getElementById('guestList');
    guestList.innerHTML = ''; // Očisti trenutnu listu

    // Kreiraj nove elemente za sve korisnike
    users.forEach(nickname => {
        const guestId = `guest-${nickname}`;
        const newGuest = document.createElement('div');
        newGuest.classList.add('guest');
        
        // Prikazivanje imena gosta kao string
        newGuest.textContent = nickname;

        // Zadržavanje postojećih stilova iz `guestsData`
        const guestData = loadGuestData(guestId);
        newGuest.style.color = guestData.color;
        newGuest.style.fontWeight = guestData.isBold ? 'bold' : 'normal';
        newGuest.style.fontStyle = guestData.isItalic ? 'italic' : 'normal';

        addGuestStyles(newGuest, guestId); // Dodaj stilove za novog gosta
        guestList.appendChild(newGuest); // Dodaj u listu
    });
});

// Funkcija za brisanje chata
function deleteChat() {
    if (confirm('Da li ste sigurni da želite obrisati chat?')) {
        const messageArea = document.getElementById('messageArea');
        messageArea.innerHTML = ''; // Očisti sve poruke
        alert('Chat je obrisan.'); // Obaveštenje korisniku
    }
}

// Osluškivanje klika na dugme "D"
document.getElementById('openModal').onclick = function() {
    deleteChat(); // Pozivamo funkciju za brisanje chata
};
