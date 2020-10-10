import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDPr29VcKDpQOQS4-0WQhhbCKvd-xODefg",
    authDomain: "instagram-clone-aecf1.firebaseapp.com",
    databaseURL: "https://instagram-clone-aecf1.firebaseio.com",
    projectId: "instagram-clone-aecf1",
    storageBucket: "instagram-clone-aecf1.appspot.com",
    messagingSenderId: "380325878970",
    appId: "1:380325878970:web:bd440fddd2150d03127683",
    measurementId: "G-P7SQ6VNVGD"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
export {db, auth, storage};
