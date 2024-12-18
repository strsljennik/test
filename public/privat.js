let isPrivateChatEnabled = false; // Status privatnog chata
let selectedGuest = null; // Selekcija gosta

// Event listener za dugme "Privatna poruka" (uključivanje i isključivanje privatnog chata)
document.getElementById('privateMessage').addEventListener('click', () => {
    if (isPrivateChatEnabled) {
        // Ako je privatni chat već uključen, isključujemo ga
        isPrivateChatEnabled = false;
        selectedGuest = null; // Resetujemo selektovanog gosta
        document.querySelectorAll('.guest').forEach(guest => {
            guest.style.backgroundColor = ''; // Resetujemo stil gostiju
            guest.style.pointerEvents = ''; // Ponovo omogućavamo selektovanje gostiju
        });
    } else {
        // Ako privatni chat nije uključen, uključujemo ga
        isPrivateChatEnabled = true;
    }

    const statusText = isPrivateChatEnabled ? `Privatni chat je uključen` : `Privatni chat je isključen`;
    alert(statusText);
});

document.addEventListener('DOMContentLoaded', () => {
    const guestList = document.getElementById('guestList');
    const chatInput = document.getElementById('chatInput');

    guestList.addEventListener('click', (event) => {
        if (event.target.classList.contains('guest')) {
            // Ako je privatni chat isključen, onemogućiti selektovanje gostiju
            if (!isPrivateChatEnabled) {
                return;
            }

            // Ako je isti gost kliknut, poništava selekciju (isključuje privatni chat)
            if (selectedGuest === event.target) {
                selectedGuest.style.backgroundColor = ''; // Uklanja traku selekcije
                selectedGuest = null; // Resetuje selektovanog gosta
                chatInput.value = ''; // Resetuje unos
                return;
            }

            // Postavljanje novog selektovanog gosta
            if (selectedGuest) {
                selectedGuest.style.backgroundColor = ''; // Resetuje prethodnog gosta
            }

            selectedGuest = event.target; // Postavlja novog gosta
            selectedGuest.style.backgroundColor = 'rgba(255, 255, 0, 0.3)'; // Providna žuta traka
            chatInput.value = `---->>> ${selectedGuest.textContent} : `; // Forma poruke za privatni chat
        }
    });

    // Kada korisnik pritisne Enter
    chatInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            let message = chatInput.value;

            if (isPrivateChatEnabled && selectedGuest) {
                // Emisija privatne poruke
                const recipient = selectedGuest.textContent;
                const time = new Date().toLocaleTimeString();

                socket.emit('private_message', {
                    to: recipient,
                    message,
                    time,
                    bold: isBold,
                    italic: isItalic,
                    color: currentColor,
                    underline: isUnderline,
                    overline: isOverline
                });

                // Forma ostaje netaknuta za privatni chat
                chatInput.value = `---->>> ${recipient} : `;
            } else {
                // Emisija obične poruke
                socket.emit('chatMessage', {
                    text: message,
                    bold: isBold,
                    italic: isItalic,
                    color: currentColor,
                    underline: isUnderline,
                    overline: isOverline
                });

                chatInput.value = ''; // Resetuje unos samo za obične poruke
            }
        }
    });
});
