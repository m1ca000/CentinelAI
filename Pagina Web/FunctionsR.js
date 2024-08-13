﻿var isPassOk;
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
    }
    if(usernameInUse){
        alert2.style.display = 'block';
        isEmailOk = false;
    }
    return isEmailOk;
}

function checkUsername() {
    var username = document.getElementById("usernameId").value;
    var alert = document.querySelector(".alertUsername");
    var alert2 = document.querySelector(".alert2Username");

    if (username.length > 25 || username.length < 4) {
        alert.style.display = 'block';
        isUsernameOk = false;
    }
    if(usernameInUse){
        alert2.style.display = 'block';
        isUsernameOk = false;
    }
    return isUsernameOk;
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