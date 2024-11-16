const mongoose = require('mongoose');

// Kreiraj model za Nikove i Boje
const userSchema = new mongoose.Schema({
  nickname: { type: String, required: true, unique: true }, // Nik korisnika
  color: { type: String, required: true }, // Boja koju korisnik izabere
});

const User = mongoose.model('User', userSchema);

// Funkcija za upisivanje korisnika sa nikom i bojom
const saveUser = async (nickname, color) => {
  const newUser = new User({
    nickname,
    color,
  });

  try {
    await newUser.save(); // Spasi korisnika u bazu
    console.log('Korisnik sa nikom i bojom je uspešno sačuvan');
  } catch (err) {
    console.error('Greška pri čuvanju korisnika:', err);
  }
};

module.exports = { saveUser };
