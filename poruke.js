// poruke.js

let trenutniKorisnici = {};  // Čuvanje podataka samo za trenutne korisnike

// Funkcija za dodavanje korisnika i njihovih podataka
const dodajKorisnika = (guestId, podaci) => {
  trenutniKorisnici[guestId] = podaci;
};

// Funkcija za dobijanje podataka o korisniku
const getKorisnikaPodaci = (guestId) => {
  return trenutniKorisnici[guestId];
};

// Funkcija za brisanje podataka korisnika
const ukloniKorisnika = (guestId) => {
  delete trenutniKorisnici[guestId];
};

// Funkcija za dobijanje svih podataka (ako je potrebno)
const getSviKorisniciPodaci = () => {
  return trenutniKorisnici;
};

// Početna dodela podataka korisniku
const pocetniPodaci = () => ({ 
  boja: 'default', 
  nik: 'Guest', 
  broj: Math.floor(Math.random() * 1000) 
});

module.exports = {
  dodajKorisnika,
  getKorisnikaPodaci,
  ukloniKorisnika,
  getSviKorisniciPodaci,
  pocetniPodaci,
};
