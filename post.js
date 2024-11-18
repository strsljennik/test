// post.js
import { Client } from 'pg';

// Kreiraj i poveži se sa bazom
const client = new Client({
  connectionString: process.env.POSTGRE_URI,
  ssl: {
    rejectUnauthorized: false,
  },
});

client.connect()
  .then(() => {
    console.log('Povezan sa PostgreSQL bazom');
  })
  .catch(err => {
    console.error('Greška pri povezivanju sa bazom:', err.stack);
  });

// Funkcija za dodelu boje na osnovu ID-a
export function getColorById(id) {
  const idStr = String(id);
  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
  const colorIndex = parseInt(idStr.split('-')[1]) % colors.length;
  return colors[colorIndex];
}

// Funkcija za dodavanje korisnika u bazu
export function addUserToDatabase(username, color, ipAddress) {
  client.query('SELECT * FROM users WHERE username = $1', [username], (err, res) => {
    if (err) {
      console.error('Greška pri upitu:', err);
    } else {
      if (res.rows.length === 0) {
        // Dodavanje novog korisnika u bazu
        client.query('INSERT INTO users (username, color, ip_address) VALUES ($1, $2, $3)', [username, color, ipAddress], (err) => {
          if (err) {
            console.error('Greška pri upisu korisnika:', err);
          } else {
            console.log(`Korisnik ${username} sa bojom ${color} i IP adresom ${ipAddress} je sačuvan.`);
          }
        });
      }
    }
  });
}

// Funkcija za dobijanje svih korisnika
export function getAllUsers() {
  return client.query('SELECT * FROM users WHERE banned = false');
}

// Funkcija za banovanje korisnika
export function banUser(username) {
  return client.query('UPDATE users SET banned = true WHERE username = $1', [username]);
}
