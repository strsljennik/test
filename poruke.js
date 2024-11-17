// poruke.js

let trenutniKorisnici = {};  // Čuvanje podataka samo za trenutne korisnike

// Funkcija za dodavanje korisnika i njihovih podataka
const dodajKorisnika = (userId, podaci) => {
  trenutniKorisnici[userId] = podaci;
};

// Funkcija za dobijanje podataka o korisniku
const getKorisnikaPodaci = (userId) => {
  return trenutniKorisnici[userId];
};

// Funkcija za brisanje podataka korisnika
const ukloniKorisnika = (userId) => {
  delete trenutniKorisnici[userId];
};

// Funkcija za dobijanje svih podataka (ako je potrebno)
const getSviKorisniciPodaci = () => {
  return trenutniKorisnici;
};

module.exports = {
  dodajKorisnika,
  getKorisnikaPodaci,
  ukloniKorisnika,
  getSviKorisniciPodaci,
};
