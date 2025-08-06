// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCp9q6-NQK28EL9jlh4jKn0_SneHyB7wSI",
  authDomain: "gym-progress-app-88e4e.firebaseapp.com",
  projectId: "gym-progress-app-88e4e",
  storageBucket: "gym-progress-app-88e4e.firebasestorage.app",
  messagingSenderId: "582971858336",
  appId: "1:582971858336:web:d743da093edc9ca4e358c5",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export const auth = getAuth(app);
