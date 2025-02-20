const authorizedUsers = new Set(['Radio Galaksija', 'ZI ZU', '*__X__*']);

// Event listener za dugme koje otvara modal
document.getElementById('openModal').addEventListener('click', function () {
    if (authorizedUsers.has(currentUser)) {
        // Ako je korisnik u listi ovlašćenih, otvara modal
        document.getElementById('functionModal').style.display = "block";
    } else {
        // Ako korisnik nije ovlašćen
        alert('Nemate dozvolu da otvorite ovaj panel.');
    }
});

// Zatvaranje modala
document.getElementById('closeModal').addEventListener('click', function () {
    document.getElementById('functionModal').style.display = "none";
});


// Brisanje sadržaja chata
document.getElementById('clearChat').addEventListener('click', function() {
    const chatWindow = document.getElementById('messageArea');
    chatWindow.innerHTML = ""; // Briše sve unutar chata
    console.log("Chat je obrisan.");

    // Emituj događaj serveru za brisanje chata
    socket.emit('clear-chat'); 
});

// Slušanje na 'chat-cleared' događaj
socket.on('chat-cleared', function() {
    console.log('Chat je obrisan sa servera.');
    const chatWindow = document.getElementById('messageArea');
    chatWindow.innerHTML = ""; // Briše sve unutar chata
});
// ZENO PLAYER NA DUGME
document.getElementById('sound').addEventListener('click', function() {
    const iframe = document.getElementById('radioIframe');
    const cover = document.getElementById('playerCover');
    
    // Toggles između prikaza ili skrivanja playera i cover-a
    if (iframe.style.display === 'none' || iframe.style.display === '') {
        iframe.style.display = 'block';  // Prikazi player
        cover.style.display = 'block';   // Prikazi cover
        iframe.src = iframe.src;         // Automatski pokreni zvuk, ako treba
    } else {
        iframe.style.display = 'none';   // Sakrij player
        cover.style.display = 'none';    // Sakrij cover
    }
});
//  REGISTRACIJA I LOGIN TABLA
document.getElementById('NIK').addEventListener('click', function() {
    var container = document.getElementById('authContainer');
    container.style.display = container.style.display === 'none' ? 'block' : 'none';
  });
//  BANIRANJE SA IP ADRESOM I MODAL LISTOM
let lozinkaProverena = false; // Promenljiva koja prati da li je lozinka već uneta

document.getElementById('govna').addEventListener('click', function () {
    if (!lozinkaProverena) {
        let lozinka = prompt("Unesite lozinku:");
        if (lozinka === "babaroga") {
            lozinkaProverena = true; // Postavljamo da je lozinka uneta ispravno
        } else {
            alert("Netačna lozinka!");
            return; // Ako lozinka nije tačna, prekidamo izvršenje funkcije
        }
    }

    // Nakon prve tačne lozinke, dugme normalno otvara/zatvara modal
    let uuidModal = document.getElementById('uuidModal');
    uuidModal.style.display = (uuidModal.style.display === "block") ? "none" : "block";
});

 
    uuidModal.addEventListener('mousedown', function (e) {
        isDragging = true;
        offsetX = e.clientX - uuidModal.offsetLeft;
        offsetY = e.clientY - uuidModal.offsetTop;
    });

    document.addEventListener('mousemove', function (e) {
        if (isDragging) {
           uuidModal.style.left = e.clientX - offsetX + 'px';
           uuidModal.style.top = e.clientY - offsetY + 'px';
        }
    });

    document.addEventListener('mouseup', function () {
        isDragging = false;
    });

const uuidList = document.getElementById('uuidList');

    socket.on('logMessage', (message) => {
        const [_, ipAddress, infoText] = message.match(/IP adresa: (.+) \(Info: (.*)\)/) || [];
        if (!ipAddress) return; // Ako ne može da izvuče IP adresu, ignorisi

        // Kreiranje <li> elementa za IP adresu
        let listItem = document.createElement('li');
        listItem.textContent = `IP: ${ipAddress}`;

        // Kreiranje input polja za unos dodatnog info
        let infoInput = document.createElement('input');
        infoInput.type = 'text';
        infoInput.placeholder = 'Dodaj informaciju...';
        infoInput.style.marginLeft = '10px';

        // Ako imamo već sačuvan tekst u bazi, ubacujemo ga u polje
        if (infoText && infoText !== "Nema dodatnog info") {
            infoInput.value = infoText;
        }

        // Kada admin unese tekst i izgubi fokus sa polja, čuvamo u bazi
        infoInput.addEventListener('blur', function() {
            socket.emit('saveUserNote', { ipAddress, note: infoInput.value });
        });

        listItem.appendChild(infoInput);
        uuidList.appendChild(listItem);
    });


// Selektovanje liste
let selectedItem = null;

// Dodavanje event listener-a za klik na stavku u listi
document.getElementById('uuidList').addEventListener('click', function(event) {
    // Ako je kliknuto na <li> stavku, postavi je kao selektovanu
    if (event.target.tagName === 'LI') {
        // Ako je već selektovana ista stavka, poništi selektovanje
        if (selectedItem === event.target) {
            selectedItem.classList.remove('selected');
            selectedItem = null;
        } else {
            // Poništi selektovanje prethodne stavke, ako postoji
            if (selectedItem) {
                selectedItem.classList.remove('selected');
            }
            // Selektuj novu stavku
            selectedItem = event.target;
            selectedItem.classList.add('selected');
        }
    }
});

// Akcija za brisanje
document.getElementById('delete').addEventListener('click', function() {
    if (selectedItem) {
        // Ukloni selektovanu stavku sa liste
        selectedItem.remove();

      }
});

document.getElementById('blokip').addEventListener('click', function() {
    if (selectedItem) {
        // Ekstrakcija IP adrese pomoću regularnog izraza
        let ipMatch = selectedItem.textContent.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/);
        
        if (ipMatch) {
            let ipAddress = ipMatch[0]; // Prava IP adresa iz teksta
            
            // Emitovanje događaja za banovanje
            socket.emit('banUser', ipAddress);
            
            console.log(`Banovan korisnik sa IP adresom: ${ipAddress}`);
        } else {
            alert("Nije pronađena validna IP adresa!");
        }
    } else {
        alert("Niste izabrali korisnika za banovanje!");
    }
});
