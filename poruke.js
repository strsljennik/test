const mongoose = require('mongoose');

// Definisanje modela za korisnika
const userSchema = new mongoose.Schema({
  nickname: { type: String, required: true, unique: true },
  color: { type: String, required: true },
  sessionId: { type: String, unique: true },
});

const User = mongoose.model('User', userSchema);

// Funkcija za čuvanje korisnika
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

// Funkcija za učitavanje svih korisnika prilikom startovanja servera
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

// Spajanje na MongoDB
mongoose.connect('mongodb://localhost:27017/your_database_name', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Povezivanje sa bazom uspešno.');
}).catch(err => {
  console.error('Greška pri povezivanju sa bazom:', err);
});

// Korišćenje modula za konekciju
module.exports = { saveUser, loadAllUsers, initializeUsers };
