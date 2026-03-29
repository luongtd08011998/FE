// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD80NJuCBykd4l-8H5PgyZCKvH0OaPwrPo",
  authDomain: "projectwebsitexemtintuc.firebaseapp.com",
  projectId: "projectwebsitexemtintuc",
  storageBucket: "projectwebsitexemtintuc.firebasestorage.app",
  messagingSenderId: "551343873616",
  appId: "1:551343873616:web:69abfb96cfe700159dfb55",
  measurementId: "G-9743CL5RLW",  
};
// Initialize Firebase
initializeApp(firebaseConfig);
export const auth = getAuth();
