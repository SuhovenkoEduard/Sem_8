// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import {
  getAuth,
} from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDJ4qhMADEo2Hb-Xdl0SCC5bW26ti0qFeQ',
  authDomain: 'diabeticdiary-fedb9.firebaseapp.com',
  projectId: 'diabeticdiary-fedb9',
  storageBucket: 'diabeticdiary-fedb9.appspot.com',
  messagingSenderId: '1018876156693',
  appId: '1:1018876156693:web:7042656da3b1132063a71c',
  measurementId: 'G-RDTQC98HRR',
}

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig)
export const auth = getAuth(firebaseApp)
