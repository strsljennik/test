document.getElementById("roboti").addEventListener("click", function() {
    let guestList = document.getElementById("guestList");

    // Proveri da li su virtuelni gosti već prikazani
    if (!guestList.querySelector(".virtual-guest")) {
        // Dodaj goste
        let guests = [
            { name: "Gost-5350", color: "white" },
            { name: "Gost-7371", color: "white" },
            { name: "Hasan", color: "lightblue" },
            { name: "Jusuf", color: "green" },
            { name: "Gost-5348", color: "white" },
            { name: "Gost-6849", color: "white" },
            { name: "Sanella", color: "red" },
            { name: "Gost-4452", color: "white" },
            { name: "Gost-5553", color: "green" },
            { name: "Gost-9595", color: "blue" },
            { name: "Gost-1255", color: "purple" },
            { name: "Gost-2689", color: "orange" }
        ];

        // Pošaljemo goste serveru
        socket.emit('addVirtualGuests', guests);

        // Dodaj svakog virtuelnog gosta u listu na klijentu
        guests.forEach(guest => {
            let guestDiv = document.createElement("div");
            guestDiv.textContent = guest.name;
            guestDiv.style.color = guest.color;
            guestDiv.classList.add("virtual-guest"); // Dodaj klasu za virtuelne goste
            guestList.appendChild(guestDiv);
        });
    } else {
        // Ako su virtuelni gosti već prikazani, ukloni ih
        let virtualGuests = guestList.querySelectorAll(".virtual-guest");
        virtualGuests.forEach(guest => guest.remove());

        // Pošaljemo serveru informaciju da treba da ukloni virtuelne goste
        socket.emit('removeVirtualGuests');
    }
});
// Prikazivanje virtuelnih gostiju kada server pošalje ažurirane goste
socket.on('updateVirtualGuests', (guests) => {
    let guestList = document.getElementById("guestList");
    guestList.innerHTML = ""; // Očisti trenutnu listu gostiju

    guests.forEach(guest => {
        let guestDiv = document.createElement("div");
        guestDiv.textContent = guest.name;
        guestDiv.style.color = guest.color;
        guestDiv.classList.add("virtual-guest"); // Dodaj klasu za virtuelne goste
        guestList.appendChild(guestDiv);
    });
});


