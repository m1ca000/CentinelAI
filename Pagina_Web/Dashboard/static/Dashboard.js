const items = document.querySelectorAll('.upper-bar li');
const blocks = document.querySelectorAll('.block');
let activeBlock = document.querySelector('.block.active');

items.forEach(item => {
    item.addEventListener('click', function() {
        items.forEach(i => i.classList.remove('active'));
        this.classList.add('active');

        const target = this.getAttribute('data-target');
        const newBlock = document.querySelector(`.${target}`);

        if (activeBlock !== newBlock) {
            const direction = (Array.from(blocks).indexOf(newBlock) < Array.from(blocks).indexOf(activeBlock)) ? 'left' : 'right';
            
            activeBlock.classList.add(`slide-out-${direction}`);
            activeBlock.style.opacity = '0';

            newBlock.style.display = 'block';
            newBlock.classList.add(`slide-in-${direction}`);
            newBlock.style.opacity = '0';

            setTimeout(() => {
                newBlock.classList.remove(`slide-in-${direction}`);
                newBlock.style.opacity = '1';

                activeBlock.classList.remove(`active`, `slide-out-${direction}`);
                activeBlock.style.display = 'none';
                activeBlock.style.opacity = '0';

                activeBlock = newBlock;
                activeBlock.classList.add('active');
            }, 500); // Duration should match the CSS transition time
        }
    });
});

//Camera
document.querySelector('.move-0').addEventListener('click', () => sendValue(0, 'angle'));
document.querySelector('.move-45').addEventListener('click', () => sendValue(45, 'angle'));
document.querySelector('.move-90').addEventListener('click', () => sendValue(90, 'angle'));
document.querySelector('.move-135').addEventListener('click', () => sendValue(135, 'angle'));
document.querySelector('.move-180').addEventListener('click', () => sendValue(180, 'angle'));

document.querySelector('.unlock').addEventListener('click', () => sendValue(300, 'unlock'));

function sendValue(value, type) {
    let bodyData = {};
    bodyData[type] = value;

    fetch('http://192.168.82.177/set_angle', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
                        'authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(bodyData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

//Group
function createGroup() {

    fetch('https://centinel-ai.vercel.app/api/createGroup',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Group created:", data);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function showCode() {
    fetch('https://centinel-ai.vercel.app/api/showInviteCode',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('display-text').textContent = JSON.stringify(data);
        })
        .catch(error => console.error('Error fetching data:', error));
}

//Dashboard
function captureAndSendImage(event) {
    if (event) event.preventDefault(); // Prevent page refresh

    fetch('http://127.0.0.1:5000/capture', {
        method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.status === 'success' && data.imagePath) {
            alert('Foto capturada y guardada!');

            // Retrieve the captured image from the provided path
            fetch(`http://127.0.0.1:5000/${data.imagePath}`)
                .then(imageResponse => imageResponse.blob())
                .then(blob => {
                    const formData = new FormData();
                    formData.append('image', blob, 'image.jpg');

                    // Send the captured image to the remote API
                    fetch('https://centinel-ai.vercel.app/api/sendImage', {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => response.json())
                    .then(apiResponse => {
                        console.log(apiResponse);
                        if (apiResponse.status === 'success') {
                            alert('Imagen enviada correctamente!');
                            updateLiveDiv(apiResponse); // Update the div with the response

                            // Delete the image from the local server
                            deleteImage(data.imagePath);
                        } else {
                            alert('Error al enviar la imagen');
                        }
                    })
                    .catch(error => console.error('Error al enviar la imagen:', error));
                })
                .catch(error => console.error('Error al obtener la imagen:', error));
        } else {
            alert('Error al capturar la foto');
        }
    })
    .catch(error => console.error('Error:', error));
}

function deleteImage(imagePath) {
    fetch(`http://127.0.0.1:5000/delete`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path: imagePath }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            console.log('Imagen eliminada del servidor');
        } else {
            console.error('Error al eliminar la imagen:', data.message);
        }
    })
    .catch(error => console.error('Error en la solicitud de eliminación:', error));
}

function updateLiveDiv(apiResponse) {
    // Select the .live div
    const liveDiv = document.querySelector('.live');
    if (!liveDiv) {
        console.error('Error: .live div not found');
        return;
    }

    // Clear the contents of the .live div
    liveDiv.innerHTML = '';

    // Add new content based on the API response
    const personDiv = document.createElement('div');
    personDiv.className = 'person';

    // Example: Add a text representation of the response
    if (apiResponse.personName) {
        personDiv.textContent = `Person identified: ${apiResponse.personName}`;
    } else {
        personDiv.textContent = 'Person not identified';
    }

    // Example: If the response contains an image URL, add it
    if (apiResponse.imageUrl) {
        const img = document.createElement('img');
        img.src = apiResponse.imageUrl;
        img.alt = 'Person Image';
        img.style.maxWidth = '100%';
        img.style.borderRadius = '8px';

        personDiv.appendChild(img);
    }

    // Append the personDiv to the .live div
    liveDiv.appendChild(personDiv);
}