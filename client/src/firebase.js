// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY ,
    authDomain: "siddhant-blog.firebaseapp.com",
    projectId: "siddhant-blog",
    storageBucket: "siddhant-blog.appspot.com",
    messagingSenderId: "97110272405",
    appId: "1:97110272405:web:eec0c6393e9d01de56ee9c",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
