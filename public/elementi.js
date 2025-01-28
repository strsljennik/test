document.addEventListener("DOMContentLoaded", () => {
    const chatButton = document.getElementById("chat");
    const chatContainer = document.getElementById("chatContainer");
    let isDraggable = false;

    chatButton.addEventListener("click", () => {
        isDraggable = !isDraggable;
        chatContainer.style.cursor = isDraggable ? "grab" : "default";

        if (isDraggable) {
            chatContainer.addEventListener("mousedown", startDrag);
        } else {
            chatContainer.removeEventListener("mousedown", startDrag);
        }
    });
    
    function startDrag(event) {
        const offsetX = event.clientX - chatContainer.offsetLeft;
        const offsetY = event.clientY - chatContainer.offsetTop;

        function move(event) {
            const x = event.clientX - offsetX;
            const y = event.clientY - offsetY;
            chatContainer.style.left = `${x}px`;
            chatContainer.style.top = `${y}px`;
            socket.emit("moveChatContainer", { x, y });
        }

        function stopDrag() {
            document.removeEventListener("mousemove", move);
            document.removeEventListener("mouseup", stopDrag);
        }

        document.addEventListener("mousemove", move);
        document.addEventListener("mouseup", stopDrag);
    }

    socket.on("updateChatContainer", (data) => {
        chatContainer.style.left = `${data.x}px`;
        chatContainer.style.top = `${data.y}px`;
    });
});
