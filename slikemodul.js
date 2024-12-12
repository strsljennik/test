let io;
let newImage = [];
let userImages = {}; // Mapa korisničkih slika

// Funkcija za setovanje io objekta
function setSocket(serverIo) {
    io = serverIo;

    io.on('connection', (socket) => {
        userImages[socket.id] = []; // Inicializacija korisničkih slika

        socket.emit('initial-images', newImage);

        socket.on('add-image', (imageSource, position, dimensions) => {
            if (!imageSource || !position || !dimensions) return;

            const image = {
                imageUrl: imageSource,
                position: position,
                dimensions: dimensions
            };

            newImage.push(image);
            userImages[socket.id].push(image);

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
                userImages[socket.id] = userImages[socket.id].filter(img => img.imageUrl !== imageUrl);
            }
            io.emit('update-images', newImage);
        });

        socket.on('disconnect', () => {
            // Ukloni slike korisnika kad se socket diskonektuje
            newImage = newImage.filter(img => !userImages[socket.id].includes(img));
            delete userImages[socket.id];
            io.emit('update-images', newImage);
        });

        socket.on('delete-all', (password) => {
            if (password === 'your_password') { // Provera lozinke
                newImage = [];
                userImages = {};
                io.emit('update-images', newImage); // Obavesti sve klijente
            } else {
                socket.emit('error', 'Pogrešna lozinka!');
            }
        });
    });
}

// Izvoz funkcije setSocket
module.exports = { setSocket };
