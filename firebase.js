// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore" 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCKCbI0o9bSF8kFiyj2cZ1tGrkwocAu_eE",
  authDomain: "inventory-management-5f0a9.firebaseapp.com",
  projectId: "inventory-management-5f0a9",
  storageBucket: "inventory-management-5f0a9.appspot.com",
  messagingSenderId: "144850453895",
  appId: "1:144850453895:web:2545c0544cc5b67c467f22",
  measurementId: "G-N1WN2NLCP8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const firestore = getFirestore(app);
export { firestore };