let isLoggedIn = false; // Status autentifikacije

document.getElementById('openModal').addEventListener('click', function () {
    if (!isLoggedIn) {
        const password = prompt("Unesite lozinku:");

        // Ako unesena lozinka odgovara, otvara modal
        if (password === "123galaksija") {
            isLoggedIn = true; // Postavljamo status na login
            document.getElementById('functionModal').style.display = "block";
        } else {
            alert("Nemate dozvolu da otvorite ovaj panel.");
        }
    } else {
        // Ako je već prijavljen, samo otvara modal
        document.getElementById('functionModal').style.display = "block";
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
