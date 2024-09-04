﻿var canLogin;

const server = "https://centinel-ai.vercel.app/api/login";
const verCode = "https://centinel-ai.vercel.app/api/verifyCode";
const local = "http://localhost:8000/api/login";

function onLoginSubmit(e){
    console.log("Submited")
    e.preventDefault();

    loginUser();
}

function showPass() {
    var x = document.getElementById("passwordId");
    var i = document.getElementById("passIconId");
    if (x.type === "password") {
        x.type = "text";
        i.classList.remove('bx-show');
        i.classList.add('bx-show');
    } else {
        x.type = "password";
        i.classList.remove('bx-show');
        i.classList.add('bx-hide');
    }
}

function LoadLogin() {
    window.location.href = 'Login.html';
}

async function loginUser(){
    const password = document.getElementById("passwordId").value;
    const email = document.getElementById("emailId").value;

    var errorMessage = document.getElementById("error-message");
    var dialogBox = document.getElementById("centerpoint", "screenShadow");

    try{
        const response = await fetch(server, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        //Login !OK
        if (response.status === 401 && errorMessage) {
            errorMessage.style.display = "block";
            dialogBox.style.display = "none";
            return;
        }
        //Login OK
        if(response.status === 200 && dialogBox){   
            dialogBox.style.display = "block";
            errorMessage.style.display = "none";
            return;
        }
    } catch (error) {
        console.error('Error during login:', error);
        if (errorMessage) {
            errorMessage.style.display = "block";
        }
    }
}

async function twoFactorAuth(){
    const userCode = document.getElementById("firts").value +
                     document.getElementById("second").value +
                     document.getElementById("third").value +
                     document.getElementById("fourth").value +
                     document.getElementById("fifth").value +
                     document.getElementById("sixth").value;

    var errorMessage = document.getElementById("wrong-code");
    console.log(userCode);

    try{
        const response = await fetch(verCode, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code })
    });
    //verf Code OK
    if(response.status === 200 && userCode){   
        if(userCode === code){
            //window.location.href = 'Dashboard.html';
            errorMessage.style.display = "none";
            console.log("Verification success");
            return;
        }
    }
    // verf Code !OK
    if(response.status === 401 && userCode){
        errorMessage.style.display = "block";   
        console.log("Verification failed");
        return;
    }
} catch (error) {
    console.error('Error during login:', error);
    if (errorMessage) {
        errorMessage.style.display = "block";
    }
}
}

function resendMail(){
    //call send mail function from backend
}

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login");

    loginForm.addEventListener("submit", onLoginSubmit);
})

function clickEvent(first, last) {
    first.value = first.value.replace(/[^0-9]/g, '');
  
    if (first.value.length) {
      document.getElementById(last).focus();
    }
  }