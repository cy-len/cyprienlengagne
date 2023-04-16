// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { adminUser } from "./stores";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD_hPXuY6NzDlZ0lq9IaLAOoMYZpc_PiJo",
    authDomain: "cyprienlengagne-73f1d.firebaseapp.com",
    projectId: "cyprienlengagne-73f1d",
    storageBucket: "cyprienlengagne-73f1d.appspot.com",
    messagingSenderId: "508066843103",
    appId: "1:508066843103:web:1fac966c3722a6f5591c6a",
    measurementId: "G-VMWJFH4G7D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);

export async function signIn(email: string, password: string) {
    const signInResult = await signInWithEmailAndPassword(auth, email, password);
    adminUser.set(signInResult.user);
}

export const db = getFirestore(app);

export const concertsCollection = collection(db, "concerts");
export async function getConcerts() {
    return getDocs(concertsCollection);
}

export const newsCollection = collection(db, "news");
export async function getNews() {
    return getDocs(newsCollection);
}

export const biosCollection = collection(db, "bios");
export async function getBios() {
    return getDocs(biosCollection);
}

export const galleryCollection = collection(db, "gallery");
export async function getPictures() {
    return getDocs(galleryCollection);
}

export const videosCollection = collection(db, "videos");
export async function getVideos() {
    return getDocs(videosCollection);
}

export const socialMediasCollection = collection(db, "socialMedias");

export const storage = getStorage(app);

const analytics = getAnalytics(app);