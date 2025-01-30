document.addEventListener('DOMContentLoaded', function () {
    const modal = document.createElement('div');
    modal.id = 'memoryModal';
    modal.style.display = 'none';
    modal.style.position = 'fixed';
    modal.style.width = '400px';
    modal.style.height = '400px';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.backgroundColor = 'black';
    modal.style.border = '2px solid #00ffff';
    modal.style.boxShadow = '0 0 20px #00ffff';
    modal.style.zIndex = '1000';
    modal.style.padding = '20px';
    modal.style.overflow = 'auto';

    modal.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <h3 style="color: #00ffff;">Unesite naziv verzije</h3>
            <button id="closeModalButton" style="color: #00ffff; background: none; border: 1px solid #00ffff; padding: 5px; cursor: pointer;">Zatvori</button>
        </div>
        <input type="text" id="newPageNameInput" placeholder="Naziv verzije" style="width: 100%; margin: 10px 0; padding: 10px; background: black; color: #00ffff; border: 1px solid #00ffff;"/>
        <button id="saveNewPageButton" style="width: 100%; padding: 10px; background: black; color: #00ffff; border: 1px solid #00ffff; cursor: pointer;">Spremi verziju</button>
        <button id="downloadPagesButton" style="width: 100%; margin-top: 10px; padding: 10px; background: black; color: #00ffff; border: 1px solid #00ffff; cursor: pointer;">Preuzmi JSON</button>
        <input type="file" id="uploadPagesInput" style="margin-top: 10px; width: 100%; color: #00ffff;"/>
        <button id="uploadPagesButton" style="width: 100%; padding: 10px; background: black; color: #00ffff; border: 1px solid #00ffff; cursor: pointer;">Učitaj JSON</button>
        <ul id="pageList" style="margin-top: 20px; color: #00ffff; padding: 0; list-style: none;"></ul>
    `;

    document.body.appendChild(modal);

    const savedPages = JSON.parse(localStorage.getItem('savedPages')) || [];
    const pageList = modal.querySelector('#pageList');
    const contentContainer = document.createElement('div');
    contentContainer.id = 'savedContent';
    contentContainer.style.marginTop = '20px';
    contentContainer.style.border = '1px solid #00ffff';
    contentContainer.style.padding = '10px';
    contentContainer.style.color = '#00ffff';

    document.body.appendChild(contentContainer);

    document.getElementById('memorija').addEventListener('click', function () {
        modal.style.display = 'block';
        renderPageList();
    });

    document.getElementById('closeModalButton').addEventListener('click', function () {
        modal.style.display = 'none';
    });

 document.getElementById('saveNewPageButton').addEventListener('click', function () {
    const pageName = document.getElementById('newPageNameInput').value;
    if (!pageName) {
        alert('Morate uneti naziv verzije.');
        return;
    }

    const images = [];
    const imgElements = document.querySelectorAll('img');

    imgElements.forEach(img => {
        const rect = img.getBoundingClientRect();
        images.push({
            src: img.src,
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height
        });
    });

    const backgroundImage = document.body.style.backgroundImage; // Dodaj pozadinsku sliku

    const pageData = {
        name: pageName,
        images: images,
        backgroundImage: backgroundImage // Spremi pozadinsku sliku
    };

    savedPages.push(pageData);
    localStorage.setItem('savedPages', JSON.stringify(savedPages));

    renderPageList();
    document.getElementById('newPageNameInput').value = '';
});

    function renderPageList() {
    pageList.innerHTML = '';
    savedPages.forEach((page, index) => {
        const li = document.createElement('li');
        li.textContent = page.name;
        li.style.cursor = 'pointer';
        li.style.padding = '10px';
        li.style.borderBottom = '1px solid #00ffff';

        li.addEventListener('click', function () {
    alert(`Učitana verzija: ${page.name}`);
    restoreImages(page.images, page.backgroundImage); // Učitaj pozadinsku sliku zajedno sa slikama
});


        // Dodaj desni klik za brisanje
        li.addEventListener('contextmenu', function(event) {
            event.preventDefault(); // Sprečava defaultni kontekst meni

            const confirmDelete = confirm(`Da li želite da obrišete verziju "${page.name}"?`);

            if (confirmDelete) {
                deleteVersion(index); // Brisanje verzije
            }
        });

        pageList.appendChild(li);
    });
}

function deleteVersion(index) {
    savedPages.splice(index, 1); // Ukloni verziju iz niza
    localStorage.setItem('savedPages', JSON.stringify(savedPages)); // Ažuriraj localStorage
    renderPageList(); // Ponovo renderuj listu verzija
}

function restoreImages(images, backgroundImage) {
    // Obnavljanje pozadinske slike
    document.body.style.backgroundImage = backgroundImage;

    const existingImages = document.querySelectorAll('img');
    existingImages.forEach(img => img.remove());

    images.forEach(imageData => {
        const img = new Image();
        img.src = imageData.src;
        img.style.position = 'absolute';
        img.style.top = imageData.top + 'px';
        img.style.left = imageData.left + 'px';
        img.style.width = imageData.width + 'px';
        img.style.height = imageData.height + 'px';

        document.body.appendChild(img);
    });

    if (window.socket) {
        socket.emit('versionLoaded', { images, backgroundImage });
    }
}

// Osluškuj za obaveštenja o učitanoj verziji
if (window.socket) {
    socket.on('versionLoaded', (data) => {
        restoreImages(data.images, data.backgroundImage); // Dodaj pozadinsku sliku
    });
}



    document.getElementById('downloadPagesButton').addEventListener('click', function () {
        if (savedPages.length === 0) {
            alert('Nema sačuvanih verzija.');
            return;
        }

        const blob = new Blob([JSON.stringify(savedPages, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'verzije_stranica.json';
        a.click();
    });

    document.getElementById('uploadPagesButton').addEventListener('click', function () {
        const fileInput = document.getElementById('uploadPagesInput');
        const file = fileInput.files[0];

        if (!file) {
            alert('Morate izabrati JSON fajl.');
            return;
        }

        const reader = new FileReader();
        reader.onload = function (event) {
            try {
                const loadedPages = JSON.parse(event.target.result);
                savedPages.length = 0;
                savedPages.push(...loadedPages);
                localStorage.setItem('savedPages', JSON.stringify(savedPages));

                renderPageList();
                alert('Fajl učitan uspešno.');
            } catch (error) {
                alert('Greška prilikom učitavanja fajla.');
            }
        };
        reader.readAsText(file);
    });

    renderPageList();
});
