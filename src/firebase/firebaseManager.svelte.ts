// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, type User } from "firebase/auth";
import { addDoc, collection, doc, getDocs, getFirestore, orderBy, query, where } from "firebase/firestore";
import { getDownloadURL, getStorage, list, ref, uploadBytesResumable, type UploadTask } from "firebase/storage";
import type { Concert } from "../types/concert";
import type { News } from "../types/news";
import type { Composition } from "../types/composition";
import type { GalleryPicture } from "../stores/gallery.svelte";
import type { Video } from "../stores/videos.svelte";
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

export class FirebaseManager {
    #app = initializeApp(firebaseConfig);

    #user: User | null = $state(null);
    get user() {
        return this.#user;
    }

    #auth = getAuth(this.#app);
    get auth() {
        return this.#auth;
    }

    #db = getFirestore(this.#app);
    get db() {
        return this.#db;
    }
    
    #storage = getStorage(this.#app);
    get storage() {
        return this.#storage;
    }

    uploadBytesResumable(path: string, bytes: Blob): UploadTask {
        const r = ref(this.#storage, path);
        return uploadBytesResumable(r, bytes);
    }

    async listFilesInFolder(path: string, pagination?: { maxResults: number, pageToken: string }) {
        const folderRef = ref(this.#storage, path);

        return list(folderRef, pagination);
    }

    async getDownloadUrlFromPath(path: string) {
        const fileRef = ref(this.#storage, path);
        return getDownloadURL(fileRef);
    }

    async signIn(email: string, password: string) {
        const signInResult = await signInWithEmailAndPassword(this.#auth, email, password);
        this.#user = signInResult.user;
    }

    #concertsCollection = collection(this.#db, "concerts");
    get concertsCollection() {
        return this.#concertsCollection;
    }

    async getConcerts() {
        return getDocs(this.#concertsCollection);
    }

    async getUpcomingConcerts() {
        const todayMorning = new Date();
        todayMorning.setHours(0, 0, 0);
        const q = query(this.#concertsCollection, where("date", ">=", todayMorning), orderBy("date", "asc"));
        return getDocs(q);
    }

    async getPastConcerts() {
        const todayMorning = new Date();
        todayMorning.setHours(0, 0, 0);
        const q = query(this.#concertsCollection, where("date", "<", todayMorning), orderBy("date", "desc"));
        return getDocs(q);
    }

    async addConcert(concert: Concert) {
        return addDoc(this.#concertsCollection, concert);
    }

    #newsCollection = collection(this.#db, "news");
    get newsCollection() {
        return this.#newsCollection;
    }

    async getNews() {
        const q = query(this.#newsCollection, orderBy("date", "desc"));
        return getDocs(q);
    }

    async addNews(news: News) {
        return addDoc(this.#newsCollection, news);
    }

    #biosCollection = collection(this.#db, "bios");
    get biosCollection() {
        return this.#biosCollection;
    }

    async getBios() {
        return getDocs(this.#biosCollection);
    }

    #galleryCollection = collection(this.#db, "gallery");
    get galleryCollection() {
        return this.#galleryCollection;
    }

    async getPictures() {
        return getDocs(this.#galleryCollection);
    }

    async addGalleryPicture(picture: GalleryPicture) {
        return addDoc(this.#galleryCollection, picture);
    }

    #videosCollection = collection(this.#db, "videos");
    get videosCollection() {
        return this.#videosCollection;
    }

    async getVideos() {
        return getDocs(this.#videosCollection);
    }

    async addVideo(video: Video) {
        return addDoc(this.#videosCollection, video);
    }

    #compositionsCollection = collection(this.#db, "compositions");
    get compositionsCollection() {
        return this.#compositionsCollection;
    }

    async getCompositions() {
        const q = query(this.#compositionsCollection, orderBy("premiereDate", "desc"));
        return getDocs(q);
    }

    async addComposition(composition: Composition) {
        return addDoc(this.#compositionsCollection, composition);
    }

    #socialMediasCollection = collection(this.#db, "socialMedias");
    socialMediasHandles() {
        return doc(this.#socialMediasCollection, "handles");
    }

    #messagesCollection = collection(this.#db, "contactMessages");
    async getAllContactMessages() {
        const q = query(this.#messagesCollection, orderBy("date", "desc"));
        return getDocs(q);
    }
}