let user;

async function login() {
    // 1. Hämta text från textfältet
    // 2. Hämta användare från servern med användarnamnet
    // 3. Logga in användare

    let HTMLTextField = document.getElementById("login-textfield");
    let fieldValue = HTMLTextField.value;
    
    try{
    let webAnswer = await fetch("/rest/login/" + fieldValue);
    
    user = await webAnswer.json();
    console.log("Login OK");
    localStorage.setItem("user", user.id);
    localStorage.setItem("username", user.username);

    window.open("/notes.html", "_self");
    }
    catch(err){
        alert("This user is not registered");
    }
}

async function register() {
    // 1. Hämta texten i textfältet
    // 2. Försök skapa användare med användarnamn som texten.
    // 3. Meddela om det gick bra eller inte.

    let HTMLusername = document.getElementById("login-textfield");
    let usernameInput = HTMLusername.value;

    let theBody = {
        username: usernameInput
    }

    let webAnswer = await fetch("/createUser", {
        body: JSON.stringify(theBody),
        method: 'POST' 
    });
    let success = await webAnswer.json();

    if(success == "true") {
        alert("User created. Now you can login!");
    } else {
        alert("User couldn't be created. Try another username!");
    }
}

var input = document.getElementById("login-textfield");
input.addEventListener("keyup", function(event) {
    event.preventDefault();
  if (event.keyCode === 13) {
   event.preventDefault();
   document.getElementById("login1").click();
  }
});