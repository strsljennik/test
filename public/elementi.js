document.addEventListener("DOMContentLoaded", () => {
    const chatButton = document.getElementById("chat");
    const chatContainer = document.getElementById("chatContainer");
    let isDraggable = false;
    let isResizable = false;

    chatButton.addEventListener("click", () => {
        isDraggable = !isDraggable;
        isResizable = !isResizable;
        chatContainer.style.cursor = isDraggable ? "grab" : isResizable ? "se-resize" : "default";

        if (isDraggable || isResizable) {
            chatContainer.addEventListener("mousedown", startAction);
        } else {
            chatContainer.removeEventListener("mousedown", startAction);
        }
    });

    function startAction(event) {
        if (isResizable && isInResizeZone(event)) {
            startResize(event);
        } else if (isDraggable) {
            startDrag(event);
        }
    }

    function isInResizeZone(event) {
        const rect = chatContainer.getBoundingClientRect();
        return event.clientX > rect.right - 10 && event.clientY > rect.bottom - 10;
    }

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

 function startResize(event) {
    const startX = event.clientX;
    const startY = event.clientY;
    const startWidth = chatContainer.offsetWidth;
    const startHeight = chatContainer.offsetHeight;

    function resize(event) {
        const width = startWidth + (event.clientX - startX);
        const height = startHeight + (event.clientY - startY);
        
        chatContainer.style.width = `${width}px`;
        chatContainer.style.height = `${height}px`;

        socket.emit("resizeChatContainer", { width, height });
    }

    function stopResize() {
        document.removeEventListener("mousemove", resize);
        document.removeEventListener("mouseup", stopResize);
    }

    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stopResize);
}

 socket.on("updateChatContainer", (data) => {
        if (data.x !== undefined && data.y !== undefined) {
            chatContainer.style.left = `${data.x}px`;
            chatContainer.style.top = `${data.y}px`;
        }
        if (data.width !== undefined && data.height !== undefined) {
            chatContainer.style.width = `${data.width}px`;
            chatContainer.style.height = `${data.height}px`;
        }
    });
});
