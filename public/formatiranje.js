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

// Funkcija za učitavanje podataka o gostima
function loadGuestData(guestId) {
    let guestData = localStorage.getItem(guestId);
    if (guestData) {
        return JSON.parse(guestData); // Učitaj podatke iz localStorage
    }
   

// Funkcija za dodavanje stilova gostima
function addGuestStyles(guestElement, guestId) {
    const colorPickerButton = document.createElement('input');
    colorPickerButton.type = 'color';
    colorPickerButton.classList.add('colorPicker');
    
    
    colorPickerButton.addEventListener('input', function() {
        guestElement.style.color = this.value;
        guestsData[guestId].color = this.value; // Ažuriraj boju u objektu
        localStorage.setItem(guestId, JSON.stringify(guestsData[guestId]));  // Spasi u localStorage
    });


    guestElement.appendChild(colorPickerButton);
}

// Kada nov gost dođe
socket.on('newGuest', function(nickname) {
    const guestId = `guest-${nickname}`;
    const guestList = document.getElementById('guestList');
    const newGuest = document.createElement('div');
    newGuest.classList.add('guest');
    
    // Prikazivanje imena gosta umesto objekta
    newGuest.textContent = nickname; // Prikazujemo nickname kao string

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
