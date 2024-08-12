var canLogin;

function onLoginSubmit(e){
    console.log("Submited")
    e.preventDefault();

    checkLogin();

    loginUser();
}

function LoadLogin() {
    window.location.href = 'Login.html';
}

function checkLogin(){
    const password = document.getElementById("passwordId");
    const username = document.getElementById("usernameId");

    var alert = document.querySelector(".alert");

    fetch('https://centinel-ai.vercel.app/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, password})
    })
    .then(response => response.text())
    .then(message => console.log(message))
    .then(data=> {
        if(password != data.password){
            canLogin = false;
            alert.style.display = "block";
        }
        else if (username != data.username){
            canLogin = false;
            alert.style.display = "block";
        }
        else{ canLogin = true;}
        alert.style.display = "none";
    })
    .catch(error => {
        console.error('Error:', error);
        console.error('Status:', error.status);
        console.error('Status Text:', error.statusText);
    });

    return canLogin;
}

function loginUser(){
    if (canLogin){

    }
}

function showMessage(){
    var dialog= document.getElementById("dialog");
}

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login");

    loginForm.addEventListener("submit", onLoginSubmit);
})