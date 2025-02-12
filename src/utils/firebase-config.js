import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBVFFtaPlQP_87ewZCBoQ9R8ao9hkY5Qa8",
    authDomain: "react-movie-site-bccab.firebaseapp.com",
    projectId: "react-movie-site-bccab",
    storageBucket: "react-movie-site-bccab.firebasestorage.app",
    messagingSenderId: "98407732049",
    appId: "1:98407732049:web:e5ed04334af88384297970",
    measurementId: "G-FELC90BTC1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(app);