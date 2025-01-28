document.addEventListener("DOMContentLoaded", () => {
    const chatButton = document.getElementById("chat");
    const chatContainer = document.getElementById("chatContainer");
   

    chatButton.addEventListener("click", () => {
        chatContainer.style.position = "absolute";
        chatContainer.style.cursor = "grab";
        
        chatContainer.addEventListener("mousedown", startDrag);
    });
    
  function startDrag(event) {
    const offsetX = event.clientX - chatContainer.offsetLeft;
    const offsetY = event.clientY - chatContainer.offsetTop;

    console.log("startDrag triggered");

    function move(event) {
        const x = event.clientX - offsetX;
        const y = event.clientY - offsetY;
        console.log("move triggered, position:", { x, y }); // Loguj svaki put kad se pozove move
        chatContainer.style.left = `${x}px`;
        chatContainer.style.top = `${y}px`;
        socket.emit("moveChatContainer", { x, y });
    }

    function stopDrag() {
        console.log("stopDrag triggered");
        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", stopDrag);
    }

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", stopDrag);
}


    // Slušaj za promene pozicije od drugih korisnika
    socket.on("updateChatContainer", (data) => {
        console.log("Received chat container position:", data); // Loguj podatke koji dolaze sa servera
        chatContainer.style.left = `${data.x}px`;
        chatContainer.style.top = `${data.y}px`;
    });
});
