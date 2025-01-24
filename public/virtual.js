const permanentGuests = [
            { nickname: 'Bala Hatun', color: 'deepskyblue' },
            { nickname: 'Halime', color: 'purple' },
            { nickname: 'Holofira', color: 'red' },
        ];

        const virtualGuests = [
            { nickname: 'Bala Hatun', messages: ['Poz Svima', 'jasaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'], color: 'deepskyblue' },
            { nickname: 'Halime', messages: ['Zdravo Sarinenge', 'opaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'], color: 'purple' },
            { nickname: 'Holofira', messages: ['Selami sarinenge', 'tooOOOOOOOOOOOOOOOOOOOOOOO'], color: 'red' },
            { nickname: 'Holofira', messages: ['*__X__* Mangava tu ❤️'], color:  'red' },
            { nickname: 'Halime', messages: ['Nas olestar cuceklike 1, Merava tuke *__X__* ❤️💋'], color: 'purple' },
            { nickname: 'Bala Hatun', messages: ['Dzabe tumen cupinen pe taro bala OV TANO SAMO MLO'], color:'deepskyblue' },
        ];

        function sendMessageToChat(guest, message) {
            const messageArea = document.getElementById('messageArea');

            const messageElement = document.createElement('div');
            messageElement.innerHTML = `<span style="color: ${guest.color}; font-weight: bold; font-style: italic;">${guest.nickname}: ${message}</span>`;
            
            // Dodavanje poruke na vrh
            messageArea.insertBefore(messageElement, messageArea.firstChild);
            
            // Dodavanje razmaka između poruka
            const spacingElement = document.createElement('div');
            spacingElement.style.height = '10px';
            messageArea.insertBefore(spacingElement, messageArea.firstChild.nextSibling);

            messageArea.scrollTop = 0; // Skrolovanje na vrh
        }

        function populatePermanentGuestList() {
            const guestList = document.getElementById('guestList');
            permanentGuests.forEach(guest => {
                const guestElement = document.createElement('div');
                guestElement.classList.add('guest');
                guestElement.textContent = guest.nickname;
                guestElement.style.color = guest.color;
                guestElement.setAttribute('data-permanent', 'true'); // Oznaka za stalne goste
                guestList.appendChild(guestElement);
            });
        }

        function addGuestToList(guest) {
            const guestList = document.getElementById('guestList');

            // Proveri da li gost već postoji u listi
            const guestExists = Array.from(guestList.children).some(el => el.textContent === guest.nickname);
            if (!guestExists) {
                const guestElement = document.createElement('div');
                guestElement.classList.add('guest');
                guestElement.textContent = guest.nickname;
                guestElement.style.color = guest.color;
                guestList.appendChild(guestElement);
            }
        }

        function startVirtualGuests() {
            const messageTimings = [
                { guestIndex: 0, messageIndex: 0, time: 0 },
                { guestIndex: 0, messageIndex: 1, time: 5 },
                { guestIndex: 1, messageIndex: 0, time: 60 },
                { guestIndex: 1, messageIndex: 1, time: 65 },
                { guestIndex: 2, messageIndex: 0, time: 120 },
                { guestIndex: 2, messageIndex: 1, time: 125 },
                { guestIndex: 3, messageIndex: 0, time: 180 },
                { guestIndex: 4, messageIndex: 0, time: 200 },
                { guestIndex: 5, messageIndex: 0, time: 220 },
            ];

            messageTimings.forEach(({ guestIndex, messageIndex, time }) => {
                setTimeout(() => {
                    const guest = virtualGuests[guestIndex];
                    sendMessageToChat(guest, guest.messages[messageIndex]);
                    addGuestToList(guest); // Dodavanje samo ako gost nije već tu
                }, time * 1000);
            });

            setTimeout(startVirtualGuests, 240 * 1000); // Ponovni ciklus nakon 240 sekundi
        }

        // Pokretanje popunjavanja liste i virtuelnih gostiju
        window.onload = () => {
            populatePermanentGuestList(); // Popuni listu sa stalnim gostima
            startVirtualGuests(); // Pokreni slanje poruka
        };
