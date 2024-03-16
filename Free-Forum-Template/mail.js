
  //   copy your firebase config informations
  const firebaseConfig = {
    apiKey: "AIzaSyAO6QmCk6oe0l9KfjKZiTFBbitFG4BG3xo",
    authDomain: "devsmith-4dcba.firebaseapp.com",
    databaseURL: "https://devsmith-4dcba-default-rtdb.firebaseio.com",
    projectId: "devsmith-4dcba",
    storageBucket: "devsmith-4dcba.appspot.com",
    messagingSenderId: "369103058842",
    appId: "1:369103058842:web:d3482b4736227f6caf2c23"
  };


// initialize firebase
firebase.initializeApp(firebaseConfig);

// reference your database
var contactFormDB = firebase.database().ref("DEVSMITH");

document.getElementById("DEVSMITH").addEventListener("submit", submitForm);

function submitForm(e) {
  e.preventDefault();

  var name = getElementVal("name");
  var title = getElementVal("title");
  var Description = getElementVal("Description");
  var Code_or_Query = getElementVal("Code_or_Query");

  saveMessages(name, title, Description, Code_or_Query);

  //   enable alert
  document.querySelector(".alert").style.display = "block";

  //   remove the alert
  setTimeout(() => {
    document.querySelector(".alert").style.display = "none";
  }, 3000);

  //   reset the form
  document.getElementById("DEVSMITH").reset();
}

const saveMessages = (name, title, Description, Code_or_Query) => {
  var newContactForm = contactFormDB.push();

  newContactForm.set({
    name: name,
    title: title,
    Description: Description,
    Code_or_Query: Code_or_Query,

  });
};

const getElementVal = (id) => {
  return document.getElementById(id).value;
};
