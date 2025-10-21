// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDSiKnHzdsCI_V__AStYB-KzUP2kd1FtO0",
  authDomain: "projetointegrador2-89b8c.firebaseapp.com",
  projectId: "projetointegrador2-89b8c",
  storageBucket: "projetointegrador2-89b8c.firebasestorage.app",
  messagingSenderId: "404127809473",
  appId: "1:404127809473:web:b4336d894dc2107d7d3940"
};

const app = initializeApp(firebaseConfig);

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);
export { db };