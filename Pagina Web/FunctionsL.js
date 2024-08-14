var canLogin;

function onLoginSubmit(e){
    console.log("Submited")
    e.preventDefault();

    checkLogin();

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

function checkLogin(){
    const password = document.getElementById("passwordId");
    const username = document.getElementById("usernameId");
    var errorMessage = document.getElementById("error-message");

    fetch('https://centinel-ai.vercel.app/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username, password: password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            errorMessage.style.display = "none";
            loginUser();
        } else {
            errorMessage.style.display = "block";
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


function loginUser(){
        var dialogBox = document.getElementById("centerpoint");

        dialogBox.style.display = 'none'; // wrtite "block" when you want to show the dialog box

        window.location.href = 'CreateGroup.html';
}

function showMessage(){
    var dialog= document.getElementById("dialog");
}

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login");

    loginForm.addEventListener("submit", onLoginSubmit);
})

function resendMail(){
    preventDefault();
}

function clickEvent(first, last) {
    first.value = first.value.replace(/[^0-9]/g, '');
  
    if (first.value.length) {
      document.getElementById(last).focus();
    }
  }