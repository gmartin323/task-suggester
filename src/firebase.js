// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD5HtsQzuu5vL4axE9kywQvJvwUieStz_M",
  authDomain: "task-suggester-e7095.firebaseapp.com",
  projectId: "task-suggester-e7095",
  storageBucket: "task-suggester-e7095.appspot.com",
  messagingSenderId: "49551163504",
  appId: "1:49551163504:web:d0a7c46daf861f2c5eb4b5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const todoCollection = collection(db, "todo")