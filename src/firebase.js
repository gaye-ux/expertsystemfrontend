import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCZsOYekym2SIpIxuItQNE_jncP0HwfzK4",
  authDomain: "quickexpert-web.firebaseapp.com",
  projectId: "quickexpert-web",
  storageBucket: "quickexpert-web.firebasestorage.app",
  messagingSenderId: "828926381427",
  appId: "1:828926381427:web:e8d9a50c96c4c119c70906"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(app);
