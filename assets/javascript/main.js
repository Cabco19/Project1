var firebaseConfig = {
    apiKey: "AIzaSyBHK6xmt8nJjEx-1ALGRF73NdXyn0AI8Gc",
    authDomain: "project1version2.firebaseapp.com",
    databaseURL: "https://project1version2.firebaseio.com",
    projectId: "project1version2",
    storageBucket: "project1version2.appspot.com",
    messagingSenderId: "885016440307",
    appId: "1:885016440307:web:d019bee8fba4dc5b62b686"
};

var globalUser;

firebase.initializeApp(firebaseConfig);

// making database and auth connection 
const db = firebase.firestore();
const auth = firebase.auth();

function changeElementsVisibility(elems, displayType) {
    elems.forEach(elem => {
        elem.style.display = displayType;
    });
}

function changeElementVisibility(elem, displayType) {
    elem.style.display = displayType;
}

function createUser(userId, firstName, lastName, email) {
    db.collection("Users").doc(userId).set({
        firstName: firstName,
        lastName: lastName,
        email: email
    });
}

function getUserRef(userId) {
    var userRef = db.collection("Users").doc(userId).get();

    return userRef;
}

function createArtist(genre, imageURL, name, songName, songURL) {
    db.collection("Artists").add({
        genre: genre,
        imageURL: imageURL, 
        name: name, 
        songName: songName,
        songURL: songURL
    });
}

// grabbing onto user credentials modal
let userLoginModal = document.getElementById("user-login-modal");
let userSignUpModal = document.getElementById("user-sign-up-modal");

// grabbing onto user credentials forms
let userSignUpForm = document.getElementById("user-sign-up-form");
let userLoginForm = document.getElementById("user-login-form");

// grabbing onto sign up, login, and logout links
var signUpLink = document.querySelector(".sign-up-input-link");
var loginLink = document.querySelector(".login-input-link");
var logoutLink = document.querySelector(".logout-input-link");

// grabbing onto all links to bring up modal
let userCredentialLinks = document.querySelectorAll(".credential-input-link");

// displaying sign up page when user clicks on sign up link
signUpLink.addEventListener("click", event => {
    event.preventDefault();

    userSignUpModal.style.display = "block";
});

// displaying login page when user clicks on login link
loginLink.addEventListener("click", event => {
    event.preventDefault();

    userLoginModal.style.display = "block";
});

// grabbing onto user credentials, creating a User object, adding credential to
// the database, and logging user into the application
userSignUpForm.addEventListener("submit", event => {
    event.preventDefault();

    const firstName = userSignUpForm["user-first-name-input"].value;
    const lastName = userSignUpForm["user-last-name-input"].value;
    const email = userSignUpForm["user-email-input"].value;
    const password = userSignUpForm["user-password-input"].value;
    
    auth.createUserWithEmailAndPassword(email, password).then(credential => {
        user = credential.user;
        createUser(credential.user.uid, firstName, lastName, email);

        userSignUpForm.reset();

        changeElementsVisibility([userSignUpModal, signUpLink, loginLink], "none");
        changeElementVisibility (logoutLink, "block");
    }).catch(error => {
        console.log({error});
        console.log(error.message);
    })
});

// checking user login and password against those in firebase auth
userLoginForm.addEventListener("submit", event => {
    event.preventDefault();

    const email = userLoginForm["user-email-input"].value;
    const password = userLoginForm["user-password-input"].value;

    auth.signInWithEmailAndPassword(email, password).then(credential => {

        userLoginForm.reset();
        changeElementsVisibility([userLoginModal, signUpLink, loginLink], "none");
        changeElementVisibility(logoutLink, "block");
    }).catch(error => {
        console.log(error.message);
    })
});

loginLink.addEventListener("click", event => {
    event.preventDefault();

    auth.signOut();
});

auth.onAuthStateChanged(user => {
    // do shit based on if the user is null or not
    if(user) {
        var userData;

        getUserRef(user.uid).then(document => {
            userData = document.data();
            console.log(userData);

        });
    } else {
        console.log("user logged out");
        console.log({user});
    }
});

createArtist("rap", "www.sdfaf.com", "balls", "Nas Is Like", "www.nasislike.com");

// db.collection("Artists").doc("2cWHmSXwzIY0WLRPBOdW").get().then(doc => {
//     console.log(doc);
// })