let user;

async function login() {
    // 1. Hämta text från textfältet
    // 2. Hämta användare från servern med användarnamnet
    // 3. Logga in användare

    let HTMLTextField = document.getElementById("login-textfield");
    let fieldValue = HTMLTextField.value;

    let webAnswer = await fetch("/rest/login/" + fieldValue);
    user = await webAnswer.json();

    console.log("userid = " + user.id);
    localStorage.setItem("user", user.id);

    window.open("/notes.html", "_self");
}

async function register() {
    // 1. Hämta texten i textfältet
    // 2. Försök skapa användare med användarnamn som texten.
    // 3. Meddela om det gick bra eller inte.

    let HTMLusername = document.getElementById("login-textfield");
    let username = HTMLusername.value;

    let theBody = {
        username: username
    }

    let webAnswer = await fetch("/createUser", {
        body: JSON.stringify(theBody),
        method: 'POST' 
    });
    let success = await webAnswer.json();

    alert("User created: " + success);
}

var input = document.getElementById("login-textfield");
input.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
   event.preventDefault();
   document.getElementById("login1").click();
  }
});