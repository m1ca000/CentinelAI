var isPassOk;

const server = "https://centinel-ai.vercel.app/api/register";
const verify = "https://centinel-ai.vercel.app/api/#";
const local = "http://localhost:3000/api/register";

function showPass() {
    var x = document.getElementById("passwordId");
    var y = document.getElementById("checkPasswordId");
    var i = document.getElementById("passIconId");
    if (x.type === "password") {
        x.type = "text";
        y.type = "text";
        i.classList.remove('bx-show');
        i.classList.add('bx-show');
    } else {
        x.type = "password";
        y.type = "password";
        i.classList.remove('bx-show');
        i.classList.add('bx-hide');
    }
}

async function registerUser() {
    var username = document.getElementById('usernameId').value;
    var email = document.getElementById('emailId').value;
    var password = document.getElementById('passwordId').value;

    var alertEmail2 = document.getElementsByClassName('alertEmail2')[0];
    var alertUsername2 = document.getElementsByClassName('alertUsername2')[0];

    try {
        const response = await fetch(server, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, username, password })
        });

        if (response.status === 400 && alertEmail2) {
            alertEmail2.style.display = "block";
            return;
        }
        if (response.status === 401 && alertUsername2) {
            alertUsername2.style.display = "block";
            return;
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data.message);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

function checkPass() {
    var password = document.getElementById("passwordId").value;
    var confirmPassword = document.getElementById("checkPasswordId").value;
    var errorMessage = document.getElementById("error-message");

    if (password !== confirmPassword) {
        errorMessage.style.display = 'block';
        document.getElementById("passwordId").style.color = 'red';
        document.getElementById("checkPasswordId").style.color = 'red';
        isPassOk = false;
    } else {
        errorMessage.style.display = 'none';
        document.getElementById("passwordId").style.color = 'white';
        document.getElementById("checkPasswordId").style.color = 'white';
        isPassOk = true;
    }
    return isPassOk;
}

async function onRegisterSubmit(e) {
    console.log("Submitted")
    e.preventDefault();

    checkPass();
    if (isPassOk) {
        registerUser();
    }
}

async function verifyEmail(e){
    e.preventDefault();

    const alert = document.getElementById('verificationAlert');
    const btm = document.getElementById('verificationBtn');

    try{
        const response = await fetch(verify, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ verified: true })
        });
    
        if(response.status === 200){
            console.log('Email verified!');
            alert.style.display = 'block';
        }
    }catch (error) {
        console.error('Error:', error.message);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("register");

    if (registerForm) {
        registerForm.addEventListener("submit", onRegisterSubmit);
    }
});