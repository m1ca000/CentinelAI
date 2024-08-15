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
    const password = document.getElementById("passwordId").value;
    const username = document.getElementById("usernameId").value;
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
            canLogin = true;
        } else {
            errorMessage.style.display = "block";
            errorMessage.textContent = data.message || "Login failed. Please check your username and password.";
            canLogin = false;
        }
    })
    .catch(error => {
        errorMessage.style.display = "block";
        errorMessage.textContent = "An error occurred. Please try again later.";
        canLogin = false;
    });
    return canLogin;
}


function loginUser(){
        var dialogBox = document.getElementById("centerpoint");

    if(canLogin){
        //dialogBox.style.display = 'block';
        //window.location.href = 'Groups.html';
        console.log("Login success");
    }
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