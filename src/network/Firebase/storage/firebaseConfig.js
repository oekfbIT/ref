// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBcjqmnsPYYNYMlrTz6p2xQjLPw67YFSsY",
    authDomain: "oekfbbucket.firebaseapp.com",
    projectId: "oekfbbucket",
    storageBucket: "oekfbbucket.appspot.com",
    messagingSenderId: "805622026908",
    appId: "1:805622026908:web:4b2226bad206d68ed69359",
    measurementId: "G-4LS7QNF72N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

export { auth, storage };
