const mongoose = require('mongoose');

// Definisanje modela poruke
const messageSchema = new mongoose.Schema({
  nickname: String,
  text: String,
  bold: Boolean,
  italic: Boolean,
  color: String,
  time: String,
});

const Message = mongoose.model('Message', messageSchema);

// Funkcija za upisivanje poruka u bazu
const saveMessage = async (messageData) => {
  const newMessage = new Message({
    nickname: messageData.nickname,
    text: messageData.text,
    bold: messageData.bold,
    italic: messageData.italic,
    color: messageData.color,
    time: messageData.time,
  });

  try {
    await newMessage.save();
  } catch (err) {
    console.error('Greška pri čuvanju poruke:', err);
  }
};

// Funkcija za preuzimanje svih poruka
const getAllMessages = async () => {
  try {
    const messages = await Message.find();
    return messages;
  } catch (err) {
    console.error('Greška pri preuzimanju poruka:', err);
    return [];
  }
};

module.exports = { saveMessage, getAllMessages };
