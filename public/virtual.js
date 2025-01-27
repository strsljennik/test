const permanentGuests = [
            { nickname: 'Bala Hatun', color: 'deepskyblue' },
            { nickname: 'Halime', color: 'purple' },
            { nickname: 'Holofira', color: 'red' },
        ];

        const virtualGuests = [
            { nickname: 'Bala Hatun', messages: ['Poz Svima', 'jasaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'], color: 'deepskyblue' },
            { nickname: 'Halime', messages: ['Zdravo Sarinenge', 'opaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'], color: 'purple' },
            { nickname: 'Holofira', messages: ['Selami sarinenge', 'toooooooooooooooooooooooo'], color: 'red' },
            { nickname: 'Holofira', messages: ['*__X__* Mangava tu ❤️'], color:  'red' },
            { nickname: 'Halime', messages: ['Nas olestar lolije ili ka sredinav ti frizura, Merava tuke *__X__* ❤️💋'], color: 'purple' },
            { nickname: 'Bala Hatun', messages: ['Dzabe tumen cupinen pe taro bala OV TANO SAMO MLO'], color:'deepskyblue' },
               { nickname: 'Holofira', messages: ['Za svet sI možda jedna osoba, ali za jednu osobu ste ti (X) ceo svet'], color: 'red' },   
             { nickname: 'Halime', messages: ['Volim te X.  To je početak i kraj svegaa'], color: 'purple' },       
                     { nickname: 'Bala Hatun', messages: ['Volim te X ne samo zbog onoga što jesi, već i zbog onoga što sam ja kad sam s tobom'], color:'deepskyblue' },
            { nickname: 'Halime', messages: ['Kad sam imala 8 godina moja sestra je bila upola mladja od mene , sada imam 40, koliko ima moja sestra ? KO POGODI DOBIJA 3 PESME OD DJ-A'], color: 'purple' }, 
       { nickname: 'Holofira', messages: ['Ulicom setaju dva oca i dva sina a ipak ih je samo troje , KAKO TO ?  KO ODGOVOR ZNA 3 PESME OD DJ-A '], color:  'red' },
 { nickname: 'Bala Hatun', messages: ['Tvoje je , ali ga svi drugi vise koriste nego ti . KO POGODI 3 PESME OD DJ-A'], color:'deepskyblue' },
      { nickname: 'Holofira', messages: ['Jasaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa X samo tuke em te SUKARIPASKE '], color:  'red' },  
        { nickname: 'Halime', messages: ['Jasaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa X samo tuke em te SUZIPASKE'], color: 'purple' }, 
   { nickname: 'Bala Hatun', messages: ['Jasaaaaaaaaaaaaaaaaaaaaaaaaaaaaa X SAMO MANGE-----TUKE ARI TEJSA'], color:'deepskyblue' },    
     { nickname: 'Halime', messages: ['X ajde tejsa ava ko dorucko , dakerav tu ko 8 kad ka dzal o Ertugrul ki buti'], color: 'purple' }, 
       { nickname: 'Bala Hatun', messages: ['X ava tejsa ki vecera u 9 , o Osmani na sovela kere '], color:'deepskyblue' },   
      { nickname: 'Holofira', messages: ['X ma te ave tejsa slucajno , o Mehmeti bar kas ulo , ic na ikljovel avrijal'], color:  'red' },                
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
    let time = 0; // Početno vreme

    virtualGuests.forEach((guest, guestIndex) => {
        guest.messages.forEach((message, messageIndex) => {
            setTimeout(() => {
                sendMessageToChat(guest, message);
                addGuestToList(guest); // Dodavanje gosta u listu
            }, time * 1000);

            time += 30; // Povećavanje vremena za 30 sekundi za svaku poruku
        });
    });

    setTimeout(startVirtualGuests, time * 1000); // Ponovni ciklus
}


        // Pokretanje popunjavanja liste i virtuelnih gostiju
        window.onload = () => {
            populatePermanentGuestList(); // Popuni listu sa stalnim gostima
            startVirtualGuests(); // Pokreni slanje poruka
        };
