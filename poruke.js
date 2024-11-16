const mongoose = require('mongoose');

// Definisanje modela za korisnika (gosta ili registrovanog korisnika)
const userSchema = new mongoose.Schema({
  nickname: { type: String, required: true, unique: true },
  color: { type: String, required: true },
  sessionId: { type: String, unique: true }, // Jedinstveni ID za sesiju
});

// Model za korisnika
const User = mongoose.model('User', userSchema);

// Funkcija za upisivanje korisnika u bazu
const saveUser = async (nickname, color, sessionId) => {
  try {
    const user = new User({
      nickname,
      color,
      sessionId, // Sesija koja je dodeljena pri povezivanju
    });

    await user.save();
    console.log('Korisnik je sačuvan u bazi');
  } catch (err) {
    console.error('Greška pri čuvanju korisnika:', err);
  }
};

// Funkcija za preuzimanje korisnika po sesiji
const getUserBySession = async (sessionId) => {
  try {
    const user = await User.findOne({ sessionId });
    return user;
  } catch (err) {
    console.error('Greška pri preuzimanju korisnika:', err);
  }
};

module.exports = { saveUser, getUserBySession };
