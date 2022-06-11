import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDvPUIGZGwYl73Sg4pUkNAQ7l_TVJQOrEM",
  authDomain: "bridge-erp-2c742.firebaseapp.com",
  projectId: "bridge-erp-2c742",
  storageBucket: "bridge-erp-2c742.appspot.com",
  messagingSenderId: "881089781631",
  appId: "1:881089781631:web:b5b59b6908c47ad9ff844a",
  measurementId: "G-F8HE8QPNN6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
