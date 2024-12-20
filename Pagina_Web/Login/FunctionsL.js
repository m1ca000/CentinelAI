﻿var canLogin;

const server = "https://centinel-ai.vercel.app/api/login";
const verCode = "https://centinel-ai.vercel.app/api/verifyCode";
const resendEmail = "https://centinel-ai.vercel.app/api/resendEmail";
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
    var dialogBox = document.getElementById("centerpoint");

    try{
        const response = await fetch(server, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        // Procesa el JSON de la respuesta solo si el estado es 200
        if (response.status === 200) {
            const data = await response.json();
            
            if (data.token) {
                localStorage.setItem('token', data.token); // Guarda el token en localStorage
                dialogBox.style.display = "block"; // Muestra el cuadro de diálogo si el login es exitoso
                errorMessage.style.display = "none";
                console.log("Login successful, token received");
            } else {
                console.error('Error: Token no recibido');
            }
        } else if (response.status === 401 && errorMessage) {
            // Si el login falla
            errorMessage.style.display = "block";
            dialogBox.style.display = "none";
        }
    } 
    catch (error) {
        console.error('Error during login:', error);
        if (errorMessage) {
            errorMessage.style.display = "block";
        }
    }
}

async function twoFactorAuth(){
    const firstElement = document.getElementById("first");
    const secondElement = document.getElementById("second");
    const thirdElement = document.getElementById("third");
    const fourthElement = document.getElementById("fourth");
    const fifthElement = document.getElementById("fifth");
    const sixthElement = document.getElementById("sixth");

    const email = document.getElementById("emailId").value;

    if (!firstElement || !secondElement || !thirdElement || !fourthElement || !fifthElement || !sixthElement) {
        console.error('One or more elements are missing');
        return;
    }

    const code = firstElement.value +
                     secondElement.value +
                     thirdElement.value +
                     fourthElement.value +
                     fifthElement.value +
                     sixthElement.value;

    var errorMessage = document.getElementById("wrong-code");
    console.log(code);

    try{
        const response = await fetch(verCode, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`

        },
        body: JSON.stringify({ code, email})
    });

    if(response.status === 200 && code){   
        if(code === code){
            errorMessage.style.display = "none";
            console.log("Verification success");
            window.location.href = "../Dashboard/templates/Dashboard.html";
            return;
        }
    }

    if(response.status === 401 && code){
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


async function resendMail(){
    const email = document.getElementById("emailId").value;

    try{
        const response = await fetch(resendEmail, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({code, email})
    });
    }catch (error) {
        console.error('Error during login:', error);
    }
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