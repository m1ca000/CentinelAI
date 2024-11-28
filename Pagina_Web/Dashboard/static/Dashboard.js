const items = document.querySelectorAll('.upper-bar li');
const blocks = document.querySelectorAll('.block');
let activeBlock = document.querySelector('.block.active');

const sendImage = "https://centinel-ai.vercel.app/api/sendImage";

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
document.querySelector('#move-0').addEventListener('click', () => sendValue(0, 'angle'));
document.querySelector('#move-45').addEventListener('click', () => sendValue(45, 'angle'));
document.querySelector('#move-90').addEventListener('click', () => sendValue(90, 'angle'));
document.querySelector('#move-135').addEventListener('click', () => sendValue(135, 'angle'));
document.querySelector('#move-180').addEventListener('click', () => sendValue(180, 'angle'));

document.querySelector('#unlock').addEventListener('click', () => sendValue(300, 'unlock'));

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

function recognizedPerson(type, value){
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

function unrecognizedPerson(){
    alert("Unrecognized person detected! Taking necessary actions.");
}

function Capture(){
    fetch('http://127.0.0.1:5000/capture', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        mode: 'cors' // Ensure CORS mode is set
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Capture request failed with status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Capture response:', data); // Debug: Check capture response

        if (data.status === 'success' && data.imagePath) {
            const imageUrl = `http://127.0.0.1:5000${data.imagePath}`;
            console.log('Fetching image from URL:', imageUrl);

            // Fetch the image as a blob
            return fetch(imageUrl)
                .then(imageResponse => {
                    if (!imageResponse.ok) {
                        throw new Error('Image fetch failed');
                    }
                    return imageResponse.blob(); // Return the blob
                });
        } else {
            alert('Error al capturar la foto');
            throw new Error('Image path not found in response');
        }
    })
}

//Not Working Dashboard
function captureAndSendImage(event) {
    if (event) event.preventDefault(); // Prevent page refresh

    // Capture the photo and send it to the server
    fetch('http://127.0.0.1:5000/capture', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        mode: 'cors' // Ensure CORS mode is set
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Capture request failed with status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Capture response:', data); // Debug: Check capture response

        if (data.status === 'success' && data.imagePath) {
            const imageUrl = `http://127.0.0.1:5000${data.imagePath}`;
            console.log('Fetching image from URL:', imageUrl);

            // Fetch the image as a blob
            return fetch(imageUrl)
                .then(imageResponse => {
                    if (!imageResponse.ok) {
                        throw new Error('Image fetch failed');
                    }
                    return imageResponse.blob(); // Return the blob
                });
        } else {
            alert('Error al capturar la foto');
            throw new Error('Image path not found in response');
        }
    })
    .then(blob => { // Here is where we receive the blob
        const formData = new FormData();
        formData.append('image', blob, 'image.jpg');

        return fetch(sendImage, {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            mode: 'cors' // Ensure CORS mode is set
        });
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to send image');
        }
        return response.json();
    })
    .then(apiResponse => {
        console.log('API response:', apiResponse);
        if (apiResponse.status === 'success') {
            alert('Imagen enviada correctamente!');
            updateLiveDiv(apiResponse);
            deleteImage(data.imagePath);
        } else {
            alert('ALAHUALA');
        }
    })
    .catch(error => {
        console.error('Error en enviar de imagen:', error.message || error);
        console.error('Error details:', error.message);
    });
}

async function deleteImage(imagePath) {
    try {
        const response = await fetch(`http://127.0.0.1:5000/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ path: imagePath }),
        });

        const data = await response.json();
        if (data.status === 'success') {
            console.log('Imagen eliminada del servidor');
        } else {
            console.error('Error al eliminar la imagen:', data.message);
        }
    } catch (error) {
        console.error('Error en la solicitud de eliminación:', error);
    }
}

function updateLiveDiv(apiResponse) {
    // Step 5: Update the live div with the new image and information
    const liveDiv = document.querySelector('.live');
    if (!liveDiv) {
        console.error('Error: .live div not found');
        return;
    }

    // Clear previous contents of the live div
    liveDiv.innerHTML = '';

    // Create a new div for the person identified
    const personDiv = document.createElement('div');
    personDiv.className = 'person';

    // Display the name if available
    if (apiResponse.personName) {
        personDiv.textContent = `Person identified: ${apiResponse.personName}`;
    } else {
        personDiv.textContent = 'Person not identified';
    }

    // If the response contains an image URL, display the image
    if (apiResponse.imageUrl) {
        const img = document.createElement('img');
        img.src = apiResponse.imageUrl; // Make sure the image URL is complete
        img.alt = 'Person Image';
        img.style.maxWidth = '100%';
        img.style.borderRadius = '8px';

        personDiv.appendChild(img);
    }

    // Append the newly created div to the .live div
    liveDiv.appendChild(personDiv);
}