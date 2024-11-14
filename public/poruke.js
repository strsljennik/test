let lastMessage = "";
let lastSender = "";
let isMessageCooldown = false;

function onMessageReceived(sender, newMessage) {
    const trimmedMessage = newMessage.trim();

    if (isMessageEmpty(trimmedMessage)) {
        console.log("Prazne poruke nisu dozvoljene.");
        return;
    }

    if (isIdenticalToLastMessage(sender, trimmedMessage)) {
        console.log("Identične poruke ne mogu biti poslate uzastopno od istog pošiljaoca.");
        return;
    }

    sendMessage(sender, trimmedMessage);
}

function isMessageEmpty(message) {
    return message.length === 0;
}

function isIdenticalToLastMessage(sender, message) {
    return message === lastMessage && sender === lastSender && isMessageCooldown;
}

function sendMessage(sender, message) {
    lastMessage = message;
    lastSender = sender;
    isMessageCooldown = true;

    console.log("Poruka je poslata od " + sender + ": " + message);

    setTimeout(() => {
        isMessageCooldown = false;
    }, 1000);
}

// Primer korišćenja
onMessageReceived("User1", "   Hello   ");
onMessageReceived("User1", "Hello");
setTimeout(() => onMessageReceived("User1", "Hello"), 1100);
