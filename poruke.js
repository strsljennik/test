const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Definisanje modela za korisnika (gosta ili registrovanog korisnika)
const userSchema = new mongoose.Schema({
  nickname: { type: String, required: true, unique: true },
  color: { type: String, required: true },
  sessionId: { type: String, unique: true }, // Jedinstveni ID za sesiju
  ipAddress: { type: String }, // Polje za čuvanje IP adrese
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

// Povezivanje sa MongoDB
mongoose.connect('mongodb+srv://username:password@cluster.mongodb.net/mydatabase')
  .then(() => console.log('Povezan sa bazom!'))
  .catch(err => console.log('Greška pri povezivanju sa bazom:', err));

// Middleware za prikupljanje IP adrese korisnika
app.use((req, res, next) => {
  req.ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  next();
});

// Funkcija za upisivanje korisnika u bazu
const saveUser = async (nickname, color, sessionId, ipAddress) => {
  try {
    const user = new User({
      nickname,
      color,
      sessionId,
      ipAddress, // Čuvanje IP adrese korisnika
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

// Ruta za prijavu korisnika
app.post('/login', (req, res) => {
  const { nickname, color, sessionId } = req.body;
  const ipAddress = req.ipAddress; // Dobijanje IP adrese iz middleware-a

  // Pozivanje funkcije za čuvanje korisnika u bazi
  saveUser(nickname, color, sessionId, ipAddress)
    .then(() => res.send('Korisnik prijavljen'))
    .catch((err) => res.status(500).send('Greška pri prijavi korisnika'));
});

app.listen(3000, () => {
  console.log('Server je pokrenut na portu 3000');
});
