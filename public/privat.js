let isPrivateChatEnabled = false; // Status privatnog chata
let selectedGuest = null; // Selekcija gosta

// Event listener za dugme "Privatna poruka"
document.getElementById('privateMessage').addEventListener('click', () => {
    isPrivateChatEnabled = !isPrivateChatEnabled;
    const statusText = isPrivateChatEnabled ? `Privatni chat je uključen` : `Privatni chat je isključen`;

    if (!isPrivateChatEnabled) {
        selectedGuest = null; // Resetujemo selektovanog gosta
        document.querySelectorAll('.guest').forEach(guest => {
            guest.style.backgroundColor = ''; // Resetujemo stil gostiju
        });
    }

    console.log(statusText);
    alert(statusText);
});

document.addEventListener('DOMContentLoaded', () => {
    const guestList = document.getElementById('guestList');
    const chatInput = document.getElementById('chatInput');

    guestList.addEventListener('click', (event) => {
        if (event.target.classList.contains('guest')) {
            // Ako je isti gost kliknut, poništava selekciju (isključuje privatni chat)
            if (selectedGuest === event.target) {
                selectedGuest.style.backgroundColor = ''; // Uklanja traku selekcije
                selectedGuest = null; // Resetuje selektovanog gosta
                isPrivateChatEnabled = false; // Isključuje privatni chat
                chatInput.value = ''; // Resetuje unos
                console.log("Privatni chat isključen.");
                return;
            }

            // Postavljanje novog selektovanog gosta
            if (selectedGuest) {
                selectedGuest.style.backgroundColor = ''; // Resetuje prethodnog gosta
            }

            selectedGuest = event.target; // Postavlja novog gosta
            selectedGuest.style.backgroundColor = 'rgba(255, 255, 0, 0.3)'; // Providna žuta traka
            isPrivateChatEnabled = true; // Uključuje privatni chat

            // Forma poruke za privatni chat
            chatInput.value = `---->>> ${selectedGuest.textContent} : `;
            console.log("Privatni chat sa: ", selectedGuest.textContent);
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
                    time
                });

                console.log(`Privatna poruka poslata ${recipient}:`, message);

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
