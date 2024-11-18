// chat.js
const { Client } = require('pg'); // Uvezi pg
const pgp = require('pg-promise')(); // Uvezi pg-promise

const connectionString = 'postgres://radio_galaksija_user:8bhm0m6LkEbfUSN916ygt8szcMrvgeNu@dpg-cstia1tumphs73fp4c00-a/radio_galaksija';

// Kreiraj klijent za PostgreSQL
const client = new Client({
    connectionString: connectionString,
});

client.connect()
    .then(() => console.log('Connected to the database'))
    .catch(err => console.error('Connection error', err.stack));

const db = pgp(connectionString);

// Funkcija za čuvanje korisnika u bazi
const saveUser = async (nickname, number, color) => {
    try {
        await db.none('INSERT INTO users(nickname, number, color) VALUES($1, $2, $3)', [nickname, number, color]);
    } catch (error) {
        console.error('Error saving user:', error);
    }
};

// Funkcija za dohvat svih korisnika iz baze
const getUsers = async () => {
    try {
        const users = await db.any('SELECT * FROM users');
        return users;
    } catch (error) {
        console.error('Error retrieving users:', error);
    }
};

// Izvoz funkcija
module.exports = {
    saveUser,
    getUsers,
};

// Ako želiš da se svi korisnici učitaju na serveru nakon restarta:
const loadUsersOnStart = async () => {
    const users = await getUsers();
    // Ovde možeš implementirati logiku da nastaviš chat sa učitanim korisnicima
    console.log('Users loaded:', users);
};

// Učitaj korisnike prilikom starta
loadUsersOnStart();
