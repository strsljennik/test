const mongoose = require('mongoose');

// Definisanje modela za korisnika
const userSchema = new mongoose.Schema({
  nickname: { type: String, required: true, unique: true },
  color: { type: String, required: true },
  sessionId: { type: String, unique: true },
});

// Ako model nije definisan, koristi postojeći model
const User = mongoose.models.User || mongoose.model('User', userSchema);

// Funkcija za upisivanje korisnika u bazu
const saveUser = async (nickname, color, sessionId) => {
  try {
    const existingUser = await User.findOne({ nickname });
    if (existingUser) {
      existingUser.color = color;
      existingUser.sessionId = sessionId;
      await existingUser.save();
      console.log('Korisnik je ažuriran u bazi');
    } else {
      const user = new User({ nickname, color, sessionId });
      await user.save();
      console.log('Korisnik je sačuvan u bazi');
    }
  } catch (err) {
    console.error('Greška pri čuvanju korisnika:', err);
  }
};

// Funkcija za preuzimanje korisnika po nickname-u
const getUserByNickname = async (nickname) => {
  try {
    const user = await User.findOne({ nickname });
    return user;
  } catch (err) {
    console.error('Greška pri preuzimanju korisnika:', err);
  }
};

module.exports = { saveUser, getUserByNickname };
