// Import the functions you need from the SDKs you need
// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCoHvXehUb4F84vsRTi5ay6k1Zjt28AtZA",
  authDomain: "getthevote.firebaseapp.com",
  projectId: "getthevote",
  storageBucket: "getthevote.appspot.com",
  messagingSenderId: "138844177503",
  appId: "1:138844177503:web:503e928ecfdf7a4e97c7ea",
  measurementId: "G-F01NN2B4D1",
  databaseURL: "https://getthevote-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Get Firestore instance

export { db };