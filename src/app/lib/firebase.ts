import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCOFycb3eDmwwtoS4-jHEyCJXY_IQIjX9w",
  authDomain: "imports-manos.firebaseapp.com",
  projectId: "imports-manos",
  storageBucket: "imports-manos.appspot.com",
  messagingSenderId: "385680546399",
  appId: "1:385680546399:web:8a2dde8dc1d50c887c19ea",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
