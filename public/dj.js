const socket = io();

// Prati prisustvo DJ-a (Radio Galaksija)
let isDJ = false; // Početna vrednost
let pvEnabled = false;  // Privatne poruke su isključene po defaultu
let selectedUserId = null;  // ID korisnika kojeg će DJ banovati

// Kada se korisnik uloguje, emituj događaj za login
function login(username) {
    socket.emit('userLoggedIn', username);
}

// Prikaz trenutnog korisnika
socket.on('currentUser', ({ username, isDJ: djStatus }) => {
    isDJ = djStatus; // Postavi isDJ na pravu vrednost
    if (isDJ) {
        console.log(`Ulogovao se DJ: ${username}`);
    } else {
        console.log(`Ulogovao se gost: ${username}`);
    }
});

// Funkcija za prikaz kontekstualnog menija po desnom kliku u sredini chata
document.getElementById('chatArea').addEventListener('contextmenu', function(e) {
    e.preventDefault();
    if (isDJ) {
        // Prikaži kontrolnu tablu sa opcijama samo za DJ-a
        showControlPanel(e.pageX, e.pageY);
    }
});

// Funkcija za prikaz kontrolne table sa opcijama
function showControlPanel(x, y) {
    let panel = document.createElement('div');
    panel.id = 'controlPanel';
    panel.style.position = 'absolute';
    panel.style.top = y + 'px';
    panel.style.left = x + 'px';
    panel.style.backgroundColor = 'black';
    panel.style.color = 'white';
    panel.style.padding = '10px';
    panel.style.borderRadius = '5px';
    panel.innerHTML = `
        <p id="clearChat">Obriši chat</p>
        <p id="togglePV">${pvEnabled ? 'Isključi PV' : 'Uključi PV za sve'}</p>
        <p id="selectBanUser">Selektuj korisnika za ban</p>
        <p id="takeOver">Take Over</p>
    `;
    document.body.appendChild(panel);

    // Funkcija za brisanje chata
    document.getElementById('clearChat').addEventListener('click', function() {
        if (confirm('Da li ste sigurni da želite obrisati chat?')) {
            socket.emit('clearChat'); // Emituj događaj za brisanje chata
            alert('Chat je obrisan.');
        }
        panel.remove(); // Ukloni panel nakon akcije
    });

    // Funkcija za uključivanje ili isključivanje PV
    document.getElementById('togglePV').addEventListener('click', function() {
        pvEnabled = !pvEnabled;
        socket.emit('togglePV', { enabled: pvEnabled }); // Emituj događaj za PV
        alert(`PV za sve je sada ${pvEnabled ? 'uključen' : 'isključen'}.`);
        panel.remove(); // Ukloni panel nakon akcije
    });

    // Funkcija za selektovanje korisnika za ban
    document.getElementById('selectBanUser').addEventListener('click', function() {
        alert('Dva puta kliknite na korisnika u listi da biste ga banovali.');
        panel.remove(); // Ukloni panel nakon akcije
    });

    // Funkcija za take over (preuzimanje kontrole)
    document.getElementById('takeOver').addEventListener('click', function() {
        socket.emit('takeOver'); // Emituj događaj za take over
        alert('Preuzeli ste kontrolu nad radiom.');
        panel.remove(); // Ukloni panel nakon akcije
    });
}

// Banovanje korisnika na dva klika
let clickTimeout;
document.getElementById('guestList').addEventListener('click', function(e) {
    let targetUser = e.target;  // Korisničko ime kliknuto u listi gostiju
    if (clickTimeout) {
        clearTimeout(clickTimeout);
        selectedUserId = targetUser.dataset.userId;  // Sačuvaj ID selektovanog korisnika
        banUser(selectedUserId);
    } else {
        clickTimeout = setTimeout(() => { clickTimeout = null; }, 300);  // Resetovanje dvostrukog klika
    }
});

// Banovanje selektovanog korisnika
function banUser(userId) {
    if (isDJ && userId) {
        socket.emit('banUser', { userId: userId }); // Emituj događaj za banovanje
        alert(`Korisnik sa ID-jem ${userId} je banovan.`);
    }
}

// Ostatak tvoje funkcionalnosti za chat i socket
socket.on('chatMessage', (message) => {
    const chatWindow = document.getElementById('chat-window');
    const messageElement = document.createElement('div');
    messageElement.style.color = message.color;
    messageElement.innerHTML = `[${message.time}] <strong>${message.nickname}</strong>: ${message.text}`;

    // Proveri da li su poruke podebljane ili u kurzivu
    if (message.bold) {
        messageElement.style.fontWeight = 'bold';
    }
    if (message.italic) {
        messageElement.style.fontStyle = 'italic';
    }

    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight; // Automatski skroluj na dno
});

// Ažuriraj listu gostiju
socket.on('updateGuestList', (guestList) => {
    const guestListContainer = document.getElementById('guest-list');
    guestListContainer.innerHTML = ''; // Očisti trenutnu listu
    guestList.forEach((guest) => {
        const guestElement = document.createElement('div');
        guestElement.innerText = guest;
        guestElement.dataset.userId = guest.id; // Dodaj ID korisnika
        guestListContainer.appendChild(guestElement);
    });
});

// Kada se nova pesma pušta
socket.on('play_song', (songUrl) => {
    // Logika za puštanje pesme na klijentskoj strani
    console.log(`Puštam pesmu: ${songUrl}`);
});

// Prikaz greške
socket.on('error', (errorMessage) => {
    console.error(errorMessage);
});

// Kada korisnik klikne na dugme za prijavu
document.getElementById('login-button').addEventListener('click', () => {
    const username = document.getElementById('username-input').value;
    login(username);
});
