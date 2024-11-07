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
            'Content-Type': 'application/json'
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

//Registry
function openModal() {
    document.getElementById('modal').classList.add('active');
    document.getElementById('overlay').classList.add('active');
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
}

document.getElementById('capture').addEventListener('click', function() {
    fetch('http://127.0.0.1:5000/capture', {
        method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.status === 'success') {
            alert('Foto capturada y guardada!');
        } else {
            alert('Error al capturar la foto');
        }
    })
    .catch(error => console.error('Error:', error));
});

document.getElementById('upload').addEventListener('change', function(event) {
    const formData = new FormData();
    formData.append('file', event.target.files[0]);

    fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.status === 'success') {
            alert('Foto subida con éxito');
        } else {
            alert('Error al subir la foto');
        }
    })
    .catch(error => console.error('Error:', error));
});

//Group
fetch('https://centinel-ai.vercel.app/api/userGroup')
  .then(response => response.json())
  .then(data => {

    document.getElementById('display-text').textContent = JSON.stringify(data);
  })
  .catch(error => console.error('Error fetching data:', error));
