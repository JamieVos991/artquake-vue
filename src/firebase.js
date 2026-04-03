import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyDlmqdPTEsJOcbwbjL1Luy51CnE52slGfo",
  authDomain: "artquake-6fceb.firebaseapp.com",
  projectId: "artquake-6fceb",
  storageBucket: "artquake-6fceb.firebasestorage.app",
  messagingSenderId: "202630612295",
  appId: "1:202630612295:web:68bcc60a9cb14425f07862",
  measurementId: "G-N5F8LC5D7V",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);