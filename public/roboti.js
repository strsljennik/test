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
      
      // Dodaj svakog virtuelnog gosta u listu
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
    }
});
