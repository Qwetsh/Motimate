// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import Firestore
import { getAuth } from "firebase/auth"; // Importer Firebase Authentication
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC88mjMkrYwoXQPJ3X8wPIOULz_PNafqWI",
  authDomain: "tachesmenagere.firebaseapp.com",
  projectId: "tachesmenagere",
  storageBucket: "tachesmenagere.firebasestorage.app",
  messagingSenderId: "241215033158",
  appId: "1:241215033158:web:7a6dd8ce371f127a7d5f47",
  measurementId: "G-GNYQX9H14J",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const auth = getAuth(app); // Initialise l'authentification

export { db, auth };
