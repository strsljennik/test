  document.getElementById('smilesBtn').addEventListener('click', function () {
            const smileModal = document.getElementById('smileModal');
            const smilesBtn = document.getElementById('smilesBtn');

            if (smileModal.style.display === 'flex') return; // Ako je modal već otvoren, ne otvaraj ga ponovo

            const buttonRect = smilesBtn.getBoundingClientRect();
            smileModal.style.top = `${buttonRect.bottom + 5}px`; // Pozicionirano ispod dugmeta
            smileModal.style.left = `${buttonRect.left}px`;
            smileModal.style.display = 'flex';
        });

        // Funkcija za zatvaranje modalnog prozora
        function closeSmileModal() {
            const smileModal = document.getElementById('smileModal');
            if (smileModal) {
                smileModal.style.display = 'none';
            }
        }

        // Funkcija za dodavanje smajlova/slika u chat
        function addSmile(smile) {
            const chatInput = document.getElementById('chatInput');
            if (chatInput) {
                chatInput.value += smile;
                closeSmileModal();
            }
        }

        // Funkcija za dodavanje slike kao emotikona u chat
        function addImageToChat(imgSrc) {
            const chatInput = document.getElementById('chatInput');
            if (chatInput) {
                chatInput.value += ` <img src="${imgSrc}" alt="emoji"> `;
                closeSmileModal();
            }
        }

        // Dodavanje HTML koda za modalni prozor
        const smileModalHTML = `
            <div id="smileModal" style="
                display: none; 
                position: fixed; 
                width: 450px; 
                height: auto; 
                background: black; 
                padding: 10px; 
                border: 1px solid white; 
                z-index: 1000; 
                overflow-y: auto; 
                border-radius: 5px;
                color: white;
                flex-wrap: wrap;">
                
                <button onclick="closeSmileModal()" style="
                    background: red;
                    color: white;
                    border: none;
                    padding: 5px 10px;
                    cursor: pointer;
                    float: right;
                    font-size: 14px;
                    border-radius: 3px;
                ">X</button>
                
                <div id="smileContainer" style="display: flex; flex-wrap: wrap; gap: 8px;">
                </div>
                
                <hr style="margin: 10px 0; border-color: white;">
                
                <div id="emojiContainer" style="display: flex; flex-wrap: wrap; gap: 8px;">
                </div>
            </div>
        `;

        // Dodavanje modala u DOM ako nije već prisutan
        if (!document.getElementById('smileModal')) {
            document.body.insertAdjacentHTML('beforeend', smileModalHTML);
        }

        const emojiContainer = document.getElementById('emojiContainer');
        const smileContainer = document.getElementById('smileContainer');
        const emojiFolder = 'emoji gif/'; // Putanja do foldera sa slikama

        // Spajanje svih slika i emojija u jednu listu
        const allEmojisAndImages = [
            { type: 'emoji', content: '☕' },
            { type: 'emoji', content: '😀' },
            { type: 'emoji', content: '😂' },
            { type: 'emoji', content: '😍' },
            { type: 'emoji', content: '😎' },
            { type: 'emoji', content: '😢' },
            { type: 'emoji', content: '😡' },
            { type: 'emoji', content: '🤔' },
            { type: 'emoji', content: '👍' },
            { type: 'emoji', content: '👎' },
            { type: 'emoji', content: '😜' },
            { type: 'emoji', content: '😝' },
            { type: 'emoji', content: '😻' },
            { type: 'emoji', content: '🤩' },
            { type: 'emoji', content: '🥳' },
            { type: 'emoji', content: '🤗' },
            { type: 'emoji', content: '🤐' },
            { type: 'emoji', content: '🤟' },
            { type: 'emoji', content: '💋' },
            { type: 'emoji', content: '💕' },
            { type: 'emoji', content: '💞' },
            { type: 'emoji', content: '❤️' },
            { type: 'emoji', content: '💔' },
            { type: 'emoji', content: '🖤' },
            { type: 'emoji', content: '💛' },
            { type: 'emoji', content: '💚' },
            { type: 'emoji', content: '🌧️' },
            { type: 'emoji', content: '☀️' },
            { type: 'emoji', content: '🌷' },
            { type: 'emoji', content: '🚹' },
            { type: 'emoji', content: '🚺' },
            { type: 'emoji', content: '👁️‍🗨️' },
            { type: 'emoji', content: '👀' },
            
            // PNG slike
            { type: 'image', content: 'stik1.png' },
            { type: 'image', content: 'stik2.png' },
            { type: 'image', content: 'stik3.png' },
            { type: 'image', content: 'stik4.png' },
            { type: 'image', content: 'stik5.png' },
            { type: 'image', content: 'stik6.png' },
            { type: 'image', content: 'stik7.png' },
            { type: 'image', content: 'stik8.png' },
            { type: 'image', content: 'stik9.png' },
            { type: 'image', content: 'stik10.png' },
            
            // GIF slike
            { type: 'image', content: 'dance.gif' },
            { type: 'image', content: 'dance1.gif' },
            { type: 'image', content: 'dance2.gif' },
            { type: 'image', content: 'dance3.gif' },
            { type: 'image', content: 'ily1.gif' },
            { type: 'image', content: 'ily2.gif' },
            { type: 'image', content: 'man.gif' },
            { type: 'image', content: 'mira.gif' },
            { type: 'image', content: 'mira1.gif' },
            { type: 'image', content: 'rg.gif' },
            { type: 'image', content: 'srce.gif' },
            { type: 'image', content: 'srce2.gif' },
            { type: 'image', content: 'srce3.gif' },
            { type: 'image', content: 'srce4.gif' }
        ];

        // Iteracija kroz sve elemente i dodavanje u DOM
        allEmojisAndImages.forEach(item => {
            const element = document.createElement('span');
            let imgElement;

            if (item.type === 'emoji') {
                element.textContent = item.content;
                element.classList.add('smile');
                element.onclick = () => addSmile(item.content);
            } else if (item.type === 'image') {
                imgElement = document.createElement('img');
                imgElement.src = emojiFolder + item.content;
                imgElement.classList.add('smile');
                imgElement.alt = item.content;
                element.classList.add('smile');
                element.onclick = () => addImageToChat(emojiFolder + item.content);
                element.appendChild(imgElement);
            }

            smileContainer.appendChild(element);
        });
