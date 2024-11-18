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

// Kreiraj tabelu guest ako ne postoji
const createTable = async () => {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS guest (
        id SERIAL PRIMARY KEY,
        nickname VARCHAR(255),
        number VARCHAR(50),
        color VARCHAR(50)
    );`;

    try {
        await db.none(createTableQuery);
        console.log('Tabela "guest" je kreirana ili već postoji.');
    } catch (error) {
        console.error('Greška prilikom kreiranja tabele:', error);
    }
};

// Funkcija za čuvanje gosta u bazi
const saveGuest = async (nickname, number, color) => {
    try {
        await db.none('INSERT INTO guest(nickname, number, color) VALUES($1, $2, $3)', [nickname, number, color]);
    } catch (error) {
        console.error('Error saving guest:', error);
    }
};

// Funkcija za dohvat svih gostiju iz baze
const getGuests = async () => {
    try {
        const guests = await db.any('SELECT * FROM guest');
        return guests;
    } catch (error) {
        console.error('Error retrieving guests:', error);
    }
};

// Izvoz funkcija
module.exports = {
    saveGuest,
    getGuests,
};

// Ako želiš da se svi gosti učitaju na serveru nakon restarta:
const loadGuestsOnStart = async () => {
    const guests = await getGuests();
    // Ovde možeš implementirati logiku da nastaviš chat sa učitanim gostima
    console.log('Guests loaded:', guests);
};

// Učitaj tabelu "guest" i goste prilikom starta
const initializeDatabase = async () => {
    await createTable();
    await loadGuestsOnStart();
};

initializeDatabase();
