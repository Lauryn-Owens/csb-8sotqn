const signupForm = document.querySelector("#signup__form");

const email = document.querySelector("#email");
const password = document.querySelector("#password");
const confirmPassword = document.querySelector("#password__confirm");

const lengthRequirement = document.querySelector("#length");
const lowerCaseRequirement = document.querySelector("#lower__case");
const upperCaseRequirement = document.querySelector("#upper__case");
const numberRequirement = document.querySelector("#number");
const specialCharacterRequirement = document.querySelector(
  "#special__character"
);

//length of password requirements
const passwordRequirementLength = document.querySelectorAll(
  ".password__requirement__list__item"
).length;

const passwordErrorMessage = document.querySelector(
  "#password__error__message"
);
passwordErrorMessage.innerHTML = "";

//keep an updated version of password
password.addEventListener("keyup", (e) => {
  password.value = getValue(e.target.value);
});
//keep an updated version of confirm password
confirmPassword.addEventListener("keyup", (e) => {
  confirmPassword.value = getValue(e.target.value);
});

function getValue(target) {
  return target;
}
signupForm.addEventListener("submit", (e) => {
  //don't redirect if sign up credentials are wrong
  if (!signUp()) {
    e.preventDefault();
  } else {
    signUp();
  }
});
function signUp() {
  //flag boolean variable
  let goToDocuments = false;
  let passwordValuesSame = true;
  let emailRegistered = true;

  //password pass regex counter
  let passCounter = 0;

  //password validations
  const lowerCase = /[a-z]/g;
  const upperCase = /[A-Z]/g;
  const number = /[0-9]/g;
  const specialCharacter = /[\@\#\$\%\*\&]/g;

  //handle form errors/ form validation

  //length validation
  if (password.value.length < 8) {
    lengthRequirement.classList.add("invalid");
  } else {
    passCounter++;
    lengthRequirement.classList.add("valid");
  }
  //lower case validation
  if (!password.value.match(lowerCase)) {
    lowerCaseRequirement.classList.add("invalid");
  } else {
    passCounter++;
    lowerCaseRequirement.classList.add("valid");
  }
  //upper case validation
  if (!password.value.match(upperCase)) {
    upperCaseRequirement.classList.add("invalid");
  } else {
    passCounter++;
    upperCaseRequirement.classList.add("valid");
  }
  //number validation
  if (!password.value.match(number)) {
    numberRequirement.classList.add("invalid");
  } else {
    passCounter++;
    numberRequirement.classList.add("valid");
  }
  //special character validation
  if (!password.value.match(specialCharacter)) {
    specialCharacterRequirement.classList.add("invalid");
  } else {
    passCounter++;
    specialCharacterRequirement.classList.add("valid");
  }
  /*throw error if password
   and confirm password are not the same-> have different
  values*/
  try {
    if (confirmPassword.value !== password.value) {
      passwordValuesSame = false;
      throw "Password and Confirm Password Must Be The Same!!!";
    }
    //
    /*check for email in localStorage if true then user already has an account*/
    if (localStorage.getItem(email.value)) {
      throw `This Email ${email.value} Is Already Registered!!!`;
    }
  } catch (error) {
    passwordErrorMessage.style.display = "block";
    passwordErrorMessage.style.color = "red";
    passwordErrorMessage.innerHTML = error;
  }

  //if li length and passCounter is the same goToDocuments is true
  if (password.value !== confirmPassword.value) {
    passwordValuesSame = false;
  }
  //if email is not already registered
  if (localStorage.getItem(email.value)) {
    emailRegistered = false;
  }
  /*goToDocuments is true  if it passes all regex
  and is the same value as confirmPassword*/
  goToDocuments = passCounter === passwordRequirementLength;
  goToDocuments = goToDocuments && passwordValuesSame;
  goToDocuments = goToDocuments && emailRegistered;

  /*add input values a key value pair to localStorage if
    goToDocuments is true
    Use localstorage as database
    Add  login credentials to localStorrage
  */
  if (goToDocuments) {
    localStorage.setItem(email.value, password.value);
  }
  //reset inputs
  email.value = "";
  password.value = "";
  confirmPassword.value = "";

  return goToDocuments;
}
