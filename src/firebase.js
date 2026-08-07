import { initializeApp } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'
import { getAuth, connectAuthEmulator, signInWithCredential, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  projectId: 'senoiacar',
  appId: '1:679851800295:web:7bac4b3698b34f873ed442',
  storageBucket: 'senoiacar.firebasestorage.app',
  apiKey: 'AIzaSyAVrVJBEZefQNSHlGqenzSR8ivXW6LnB2I',
  authDomain: 'senoiacar.firebaseapp.com',
  messagingSenderId: '679851800295',
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const functions = getFunctions(app)
export const auth = getAuth(app)

if (import.meta.env.DEV) {
  connectFirestoreEmulator(db, 'localhost', 8080)
  connectFunctionsEmulator(functions, 'localhost', 5001)
  connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })
  // Emulator-only: lets tests sign in without the Google popup flow
  window.__testSignIn = (email) =>
    signInWithCredential(
      auth,
      GoogleAuthProvider.credential(JSON.stringify({ sub: email, email, email_verified: true })),
    )
}

export const EVENT_ID = '2026'
