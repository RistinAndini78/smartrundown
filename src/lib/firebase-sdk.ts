import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, onSnapshot, updateDoc, collection, deleteField } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBgqsxDktCkAtTF3fzhx61WiE-u9B1jr0c",
  authDomain: "smartdesigner-13d73.firebaseapp.com",
  projectId: "smartdesigner-13d73",
  storageBucket: "smartdesigner-13d73.firebasestorage.app",
  messagingSenderId: "85216444341",
  appId: "1:85216444341:web:65ff04c556fbe983bba3fc",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user exists in Firestore, if not create
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        name: user.displayName,
        email: user.email,
        role: 'user',
        createdAt: new Date().toISOString()
      });
    }
    
    return {
      name: user.displayName,
      email: user.email,
      uid: user.uid,
      role: userDoc.exists() ? userDoc.data().role : 'user'
    };
  } catch (error: any) {
    console.error("Error signing in with Google", error);
    throw error;
  }
}
