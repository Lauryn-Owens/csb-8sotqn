let email = document.querySelector("#email");
let password = document.querySelector("#password");

const loginButton = document.querySelector("#login__btn");
const loginForm = document.querySelector("#login__form");

const errorMessage = document.querySelector("#error__message");
errorMessage.innerHTML = "";

//keep an updated version of password
password.addEventListener("keyup", (e) => {
  password.value = getValue(e.target.value);
});

function getValue(target) {
  return target;
}

loginForm.addEventListener("submit", (e) => {
  login(e);
});
function login(event) {
  //get input values
  const correctPassword = localStorage.getItem(email.value);
  const inputPassword = password.value;
  //check if input password is the same as the stored password
  if (correctPassword !== inputPassword) {
    //don't refresh the page if login credentials are wrong
    event.preventDefault();
  }

  try {
    //check localStorage to see the login credentials is already set up
    if (localStorage.getItem(email.value) === null) {
      throw "This email is not registered, please sign up!!!";
    }
    if (localStorage.getItem(email.value) !== inputPassword) {
      throw "Incorrect Password, Try Again!!!";
    }
  } catch (error) {
    errorMessage.innerHTML = error;
  }
  //reset inputs
  email.value = "";
  password.value = "";
}
