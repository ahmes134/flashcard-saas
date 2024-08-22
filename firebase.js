// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC0TEUbFRTAv4Q5N9M_3pzrS571rGM-M6U",
  authDomain: "flashcard-saas-91993.firebaseapp.com",
  projectId: "flashcard-saas-91993",
  storageBucket: "flashcard-saas-91993.appspot.com",
  messagingSenderId: "740584306927",
  appId: "1:740584306927:web:bc648706bd1d028a4fc31a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };