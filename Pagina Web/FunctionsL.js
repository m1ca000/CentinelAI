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

    var alert = document.querySelector(".alert");


}

function loginUser(){
        var dialogBox = document.getElementById("centerpoint");

        dialogBox.style.display = 'block';
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