// Import the functions you need from the SDKs you need
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC0qtl8LyYTLXIaVDdv--SS5t0K7qu6fNg",
  authDomain: "expense-tracker-a54dd.firebaseapp.com",
  projectId: "expense-tracker-a54dd",
  storageBucket: "expense-tracker-a54dd.firebasestorage.app",
  messagingSenderId: "834383399178",
  appId: "1:834383399178:web:9625d29a8bb52d864892f3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//auth
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
//db
export const db = getFirestore(app);
