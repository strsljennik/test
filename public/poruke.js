let lastMessage = "";
let lastSender = "";
let messageTimeout = false;

function onMessageReceived(sender, newMessage) {
    const trimmedMessage = newMessage.trim();

    // Proveravamo da li je poruka prazna
    if (isMessageEmpty(trimmedMessage)) {
        console.log("Prazne poruke nisu dozvoljene.");
        return;
    }

    // Proveravamo da li je poruka identična prethodnoj od istog pošiljaoca
    if (isIdenticalToLastMessage(sender, trimmedMessage)) {
        console.log("Identične poruke ne mogu biti poslate uzastopno od istog pošiljaoca.");
        return;
    }

    // Čuvamo novu poruku i pošiljaoca
    lastMessage = trimmedMessage;
    lastSender = sender;
    messageTimeout = true;

    // Ovde možeš staviti kod za slanje poruke
    console.log("Poruka je poslata od " + sender + ": " + lastMessage);

    // Resetujemo timeout nakon 1 sekunde da bismo dopustili sledeću poruku
    setTimeout(() => {
        messageTimeout = false;
    }, 1000);
}

function isMessageEmpty(message) {
    return message.length === 0;
}

function isIdenticalToLastMessage(sender, message) {
    return message === lastMessage && sender === lastSender && messageTimeout;
}

// Primer korišćenja
onMessageReceived("User1", "   Hello   "); // Poruka je poslata od User1: Hello
onMessageReceived("User1", "Hello"); // Identične poruke ne mogu biti poslate uzastopno od istog pošiljaoca.
setTimeout(() => onMessageReceived("User1", "Hello"), 1100); // Poruka je poslata od User1: Hello (nakon 1.1 sekunde)