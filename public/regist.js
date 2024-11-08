// Registracija korisnika
document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Spreči podnošenje forme

    const username = this.querySelector('input[type="text"]').value;
    const password = this.querySelector('input[type="password"]').value;

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (response.ok) {
            alert('Registracija uspešna');
            this.reset(); // Isprazni formu
        } else {
            alert('Greška pri registraciji');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Došlo je do greške. Pokušajte ponovo.');
    });
});

// Prijava korisnika
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Spreči podnošenje forme

    const username = this.querySelector('input[type="text"]').value;
    const password = this.querySelector('input[type="password"]').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (response.ok) {
            alert('Prijava uspešna');
            console.log(`Događaj za prijavu emitovan za korisnika: ${username}`);

            socket.emit('userLoggedIn', username); // Emituj događaj sa korisničkim imenom
            this.reset(); // Isprazni formu
        } else {
            alert('Nevažeći podaci za prijavu');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Došlo je do greške. Pokušajte ponovo.');
    });
});

// Dodavanje gosta u listu (ako je korisnik gost)
document.getElementById('guestForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Spreči podnošenje forme

    const guestNickname = this.querySelector('input[type="text"]').value;

    // Emituj događaj za gosta
    socket.emit('guestLoggedIn', guestNickname); // guestNickname je ime gosta, a ne objekat
    this.reset(); // Isprazni formu
});
