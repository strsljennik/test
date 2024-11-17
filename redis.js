const redis = require('redis');

// Kreiranje Redis klijenta
const client = redis.createClient({
    url: 'redis://redis-18929.c135.eu-central-1-1.ec2.redns.redis-cloud.com:18929' // Zameni sa tvojim Redis URL-om
});

// Povezivanje sa Redis-om
client.connect().then(() => {
    console.log('Connected to Redis!');
}).catch((err) => {
    console.error('Error connecting to Redis:', err);
});

// Funkcija za postavljanje nika, boje i broja korisnika
const setUserData = async (nickname, color, number) => {
    try {
        // Koristi HSET za pohranu podataka u Redis hash
        await client.hSet(`user:${nickname}`, 'color', color);
        await client.hSet(`user:${nickname}`, 'number', number);

        console.log(`Data for ${nickname} saved in Redis.`);
    } catch (err) {
        console.error('Error saving data to Redis:', err);
    }
};

// Funkcija za dobijanje podataka korisnika iz Redis
const getUserData = async (nickname) => {
    try {
        // Dobijanje podataka korisnika iz Redis hasha
        const userData = await client.hGetAll(`user:${nickname}`);

        if (Object.keys(userData).length > 0) {
            return userData; // Vraća color i number
        } else {
            console.log(`No data found for ${nickname}.`);
            return null;
        }
    } catch (err) {
        console.error('Error fetching data from Redis:', err);
    }
};

// Funkcija za brisanje podataka korisnika iz Redis
const deleteUserData = async (nickname) => {
    try {
        await client.del(`user:${nickname}`);
        console.log(`Data for ${nickname} deleted from Redis.`);
    } catch (err) {
        console.error('Error deleting data from Redis:', err);
    }
};

// Perzistencija podataka
const enablePersistence = async () => {
    try {
        // Uključuje RDB (snapshot) perzistenciju
        await client.configSet('save', '900 1'); // Sačuvaj podatke svakih 15 minuta ako je bar jedan ključ promenjen
        console.log('RDB persistence enabled.');
        
        // Omogućava AOF (Append Only File) perzistenciju
        await client.configSet('appendonly', 'yes');
        console.log('AOF persistence enabled.');
    } catch (err) {
        console.error('Error enabling persistence:', err);
    }
};

// Pozovi enablePersistence da uključiš perzistenciju na startu
enablePersistence();

module.exports = {
    setUserData,
    getUserData,
    deleteUserData
};
