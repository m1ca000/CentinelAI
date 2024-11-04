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
        // Open and close modal functions
        function openModal() {
            document.getElementById('modal').classList.add('active');
            document.getElementById('overlay').classList.add('active');
            
            // Activate camera when modal opens
            const video = document.getElementById('video');
            navigator.mediaDevices.getUserMedia({ video: true })
                .then((stream) => {
                    video.srcObject = stream;
                })
                .catch((error) => {
                    console.error('Camera not accessible:', error);
                });
        }

        function closeModal() {
            document.getElementById('modal').classList.remove('active');
            document.getElementById('overlay').classList.remove('active');

            // Stop camera when modal closes
            const video = document.getElementById('video');
            const stream = video.srcObject;
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                video.srcObject = null;
            }
        }

        // Capture and send photo
        document.getElementById('capture').addEventListener('click', () => {
            const canvas = document.getElementById('canvas');
            const video = document.getElementById('video');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

            // Convert canvas to blob and send it
            canvas.toBlob(blob => {
                const formData = new FormData();
                formData.append('image', blob, 'captured.jpg'); // 'image' is the field name expected by the API

                fetch('https://centinel-ai.vercel.app/api/sendImage', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
            }, 'image/jpeg', 0.8);
        });

// Capture photo
document.getElementById('capture').addEventListener('click', () => {
    const canvas = document.getElementById('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/png');
    console.log(dataUrl); // Captured image
});

//Group
fetch('https://centinel-ai.vercel.app/api/userGroup')
  .then(response => response.json())
  .then(data => {
    document.getElementById('display-text').textContent = JSON.stringify(data);
  })
  .catch(error => console.error('Error fetching data:', error));
