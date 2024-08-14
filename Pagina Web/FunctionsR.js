var isPassOk;
var isUsernameOk;
var isEmailOk;

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

function checkMail() {
    var email = document.getElementById("emailId").value;
    var alert = document.querySelector(".alertEmail");
    var alert2 = document.querySelector(".alertEmail2");

    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
        alert.style.display = 'block';
        isEmailOk = false;
        return isEmailOk;
    }

    emailInUse(email).then(errorMessage => {
        if (errorMessage) {
            alert2.style.display = 'block';
            isEmailOk = false;
        } else {
            isEmailOk = true;
        }
        return isEmailOk;
    }).catch(error => {
        console.error('Error:', error);
        isEmailOk = false;
        return isEmailOk;
    });
}

function emailInUse(email) {
    return fetch('https://centinel-ai.vercel.app/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error && data.error === 'Email already in use') {
            return 'Email already in use'; 
        }
        return null; 
    })
    .catch(error => {
        console.error('Error:', error);
        return 'An error occurred';
    });
}

function checkUsername() {
    var username = document.getElementById("usernameId").value;
    var alert = document.querySelector(".alertUsername");
    var alert2 = document.querySelector(".alertUsername2");

    if (username.length > 25 || username.length < 4) {
        alert.style.display = 'block';
        isUsernameOk = false;
    }
    usernameInUse(username).then(errorMessage => {
        if (errorMessage) {
            alert2.style.display = 'block';
            isUsernameOk = false;
        } else {
            isUsernameOk = true;
        }
        return isUsernameOk;
    }).catch(error => {
        console.error('Error:', error);
        isUsernameOk = false;
        return isUsernameOk;
    });
}

function usernameInUse(username) {
    return fetch('https://centinel-ai.vercel.app/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username })
    })
    .then(response => response.text())
    .then(text => {
        try {
            const data = JSON.parse(text);
            if (data.error && data.error === 'Username already in use') {
                return 'Username already in use'; 
            }
            return null; 
        } catch (error) {
            console.error('Error parsing JSON:', error);
            return 'An error occurred';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        return 'An error occurred';
    });   
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

function registerUser() {

    var username = document.getElementById('usernameId').value;
    var email = document.getElementById('emailId').value;
    var password = document.getElementById('passwordId').value;

    if(isPassOk && isUsernameOk && isEmailOk){
        fetch('https://centinel-ai.vercel.app/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, username, password })
        })
            .then(response => response.text())
            .then(message => console.log(message))
            .catch(error => {
                console.error('Error:', error);
                console.error('Status:', error.status);
                console.error('Status Text:', error.statusText);
            });   
    }   
}

function onRegisterSubmit(e){
    console.log("Submited")
    e.preventDefault();

    checkPass();
    checkMail();
    checkUsername();

    registerUser();
}

document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("register");
    
    registerForm.addEventListener("submit", onRegisterSubmit);
})