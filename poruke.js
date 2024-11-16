const mongoose = require('mongoose');

// Povezivanje sa bazom podataka bez nepotrebnih opcija
mongoose.connect('mongodb://localhost:27017/your_database_name')
  .then(() => console.log('Povezivanje s bazom uspešno.'))
  .catch(err => console.error('Greška pri povezivanju s bazom:', err));

// Definisanje modela za korisnika
const userSchema = new mongoose.Schema({
  nickname: { type: String, required: true, unique: true },
  color: { type: String, required: true },
  sessionId: { type: String, unique: true }, // Jedinstveni ID za sesiju
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

// Funkcija za čuvanje ili ažuriranje korisnika
const saveUser = async (nickname, color, sessionId) => {
  try {
    await User.updateOne(
      { sessionId },
      { $set: { nickname, color } },
      { upsert: true } // Kreira novi unos ako ne postoji
    );
    console.log(`Korisnik ${nickname} sačuvan ili ažuriran u bazi.`);
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

// Funkcija za učitavanje svih korisnika pri pokretanju servera
const loadAllUsers = async () => {
  try {
    const users = await User.find({});
    console.log('Korisnici su uspešno učitani iz baze.');
    return users; // Vraća sve korisnike iz baze
  } catch (err) {
    console.error('Greška pri učitavanju korisnika iz baze:', err);
    return [];
  }
};

// Funkcija za inicijalizaciju podataka nakon restarta servera
const initializeUsers = async (guests, userSettings) => {
  const users = await loadAllUsers();
  users.forEach(user => {
    guests[user.sessionId] = user.nickname;
    userSettings[user.sessionId] = {
      nickname: user.nickname,
      color: user.color,
    };
  });
};

module.exports = { saveUser, getUserBySession, initializeUsers };
