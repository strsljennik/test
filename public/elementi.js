function enableDragAndResize(container) {
    let isResizing = false;
    let resizeSide = null;

    container.addEventListener('mousedown', function (e) {
        // Ignoriši događaje iz textarea
        if (e.target.tagName === 'TEXTAREA') return;

        const rect = container.getBoundingClientRect();
        const borderSize = 10;

        if (e.clientX >= rect.left && e.clientX <= rect.left + borderSize) {
            resizeSide = 'left';
        } else if (e.clientX >= rect.right - borderSize && e.clientX <= rect.right) {
            resizeSide = 'right';
        } else if (e.clientY >= rect.top && e.clientY <= rect.top + borderSize) {
            resizeSide = 'top';
        } else if (e.clientY >= rect.bottom - borderSize && e.clientY <= rect.bottom) {
            resizeSide = 'bottom';
        }

        if (resizeSide) {
            isResizing = true;
            const initialWidth = container.offsetWidth;
            const initialHeight = container.offsetHeight;
            const startX = e.clientX;
            const startY = e.clientY;

            document.onmousemove = function (e) {
                if (isResizing) {
                    if (resizeSide === 'right') {
                        container.style.width = initialWidth + (e.clientX - startX) + 'px';
                    } else if (resizeSide === 'bottom') {
                        container.style.height = initialHeight + (e.clientY - startY) + 'px';
                    } else if (resizeSide === 'left') {
                        const newWidth = initialWidth - (e.clientX - startX);
                        if (newWidth > 10) {
                            container.style.width = newWidth + 'px';
                            container.style.left = rect.left + (e.clientX - startX) + 'px';
                        }
                    } else if (resizeSide === 'top') {
                        const newHeight = initialHeight - (e.clientY - startY);
                        if (newHeight > 10) {
                            container.style.height = newHeight + 'px';
                            container.style.top = rect.top + (e.clientY - startY) + 'px';
                        }
                    }
                }
            };

            document.onmouseup = function () {
                isResizing = false;
                resizeSide = null;
                document.onmousemove = null;
                document.onmouseup = null;
            };
        } else {
            dragMouseDown(e);
        }
    });

    function dragMouseDown(e) {
        e.preventDefault();
        let pos3 = e.clientX;
        let pos4 = e.clientY;

        document.onmouseup = closeDragElement;
        document.onmousemove = function (e) {
            container.style.top = (container.offsetTop - (pos4 - e.clientY)) + 'px';
            container.style.left = (container.offsetLeft - (pos3 - e.clientX)) + 'px';
            pos3 = e.clientX;
            pos4 = e.clientY;
        };
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// Selektovanje #chatContainer i primena funkcionalnosti
const chatContainer = document.querySelector('#chatContainer');
if (chatContainer) {
    chatContainer.style.position = 'absolute'; // Obavezno postaviti na absolute
    enableDragAndResize(chatContainer);
}