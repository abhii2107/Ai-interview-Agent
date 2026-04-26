import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "vivanexa-68e54.firebaseapp.com",
  projectId: "vivanexa-68e54",
  storageBucket: "vivanexa-68e54.firebasestorage.app",
  messagingSenderId: "1042070191185",
  appId: "1:1042070191185:web:328f95b2ff684da3218c70"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export {auth, provider};
