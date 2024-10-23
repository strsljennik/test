require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(uri);
        console.log("Povezan sa bazom podataka!");
    } catch (error) {
        console.error("Greška prilikom povezivanja sa bazom:", error.message);
        process.exit(1);
    }
};

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

module.exports = { connectDB, User };
