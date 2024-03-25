import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyAW3L6FtdduOo2Rla-vyFkhVnVnFI8MEdc",
  authDomain: "reactlinks-e2fc3.firebaseapp.com",
  projectId: "reactlinks-e2fc3",
  storageBucket: "reactlinks-e2fc3.appspot.com",
  messagingSenderId: "451537465253",
  appId: "1:451537465253:web:4a100d9812047b237b424c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)

export { auth, db }