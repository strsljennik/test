const mongoose = require('mongoose');

// Proveri da li je već uspostavljena konekcija sa bazom
if (mongoose.connection.readyState === 0) {
  mongoose.connect('mongodb+srv://angeldobric:zizu100-@cluster0.kc4m1.mongodb.net/your_database', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log('Povezan sa MongoDB!'))
    .catch(err => console.error('Greška pri povezivanju sa MongoDB:', err));
} else {
  console.log('Veza sa MongoDB već postoji!');
}

// Definisanje modela za korisnika
const userSchema = new mongoose.Schema({
  nickname: { type: String, required: true, unique: true },
  color: { type: String, required: true },
  sessionId: { type: String, unique: true }, // Sesija koja je dodeljena pri povezivanju
});

// Ako model nije definisan, koristi postojeći model
const User = mongoose.models.User || mongoose.model('User', userSchema);

// Funkcija za upisivanje korisnika u bazu
const saveUser = async (nickname, color, sessionId) => {
  try {
    // Proveri da li korisnik već postoji
    const existingUser = await User.findOne({ nickname });
    if (existingUser) {
      existingUser.color = color; // Ažuriraj boju ako postoji
      existingUser.sessionId = sessionId;
      await existingUser.save();
      console.log('Korisnik je ažuriran u bazi');
    } else {
      // Ako ne postoji, napravi novog korisnika
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
