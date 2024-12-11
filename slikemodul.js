
let io;
let newImage = [];  

// Funkcija za setovanje io objekta
function setSocket(serverIo) {
    io = serverIo;

    io.on('connection', (socket) => {
        socket.emit('initial-images', newImage);

        socket.on('add-image', (imageSource, position, dimensions) => {
            if (!imageSource || !position || !dimensions) return;

            newImage.push({
                imageUrl: imageSource,
                position: position,
                dimensions: dimensions
            });

            io.emit('display-image', {
                imageUrl: imageSource,
                position: position,
                dimensions: dimensions
            });
        });

        socket.on('update-image', (data) => {
            const image = newImage.find(img => img.imageUrl === data.imageUrl);
            if (image) {
                image.position = data.position;
                image.dimensions = data.dimensions;
            }
            io.emit('sync-image', data);
        });

        socket.on('remove-image', (imageUrl) => {
            const index = newImage.findIndex(img => img.imageUrl === imageUrl);
            if (index !== -1) {
                newImage.splice(index, 1);
            }
            io.emit('update-images', newImage);
        });
    });
}

// Izvoz funkcije setSocket
module.exports = { setSocket };
