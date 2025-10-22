import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase config from google-services.json
const firebaseConfig = {
  apiKey: "AIzaSyDgMJ57NuloSZup7myB6QnSa7QhRC2G7m0",
  authDomain: "chrono-d649f.firebaseapp.com",
  projectId: "chrono-d649f",
  storageBucket: "chrono-d649f.firebasestorage.app",
  messagingSenderId: "941489768691",
  appId: "1:941489768691:android:74502fc4e7b3dc5c760f86",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth (Firebase handles persistence automatically)
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

export { auth, db };
export default app;
