const redis = require('redis');

// Kreiranje Redis klijenta
const client = redis.createClient({
    url: 'redis://redis-18929.c135.eu-central-1-1.ec2.redns.redis-cloud.com:18929' // Zameni sa tvojim Redis URL-om
});

client.connect().then(() => {
    console.log('Connected to Redis!');
}).catch((err) => {
    console.error('Error connecting to Redis:', err);
});

// Funkcija za postavljanje nika, boje i broja korisnika
const setUserData = async (nickname, color, number) => {
    try {
        // Čuvanje nika, boje i broja korisnika u Redis
        await client.set(`user:${nickname}:color`, color, 'EX', 86400);  // 'EX' postavlja TTL od 24h (86400 sekundi)
        await client.set(`user:${nickname}:number`, number, 'EX', 86400);
        console.log(`Data for ${nickname} saved in Redis.`);
    } catch (err) {
        console.error('Error saving data to Redis:', err);
    }
};

// Funkcija za dobijanje podataka korisnika iz Redis
const getUserData = async (nickname) => {
    try {
        const color = await client.get(`user:${nickname}:color`);
        const number = await client.get(`user:${nickname}:number`);
        
        if (color && number) {
            return { color, number };
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
        await client.del(`user:${nickname}:color`);
        await client.del(`user:${nickname}:number`);
        console.log(`Data for ${nickname} deleted from Redis.`);
    } catch (err) {
        console.error('Error deleting data from Redis:', err);
    }
};

module.exports = {
    setUserData,
    getUserData,
    deleteUserData
};
