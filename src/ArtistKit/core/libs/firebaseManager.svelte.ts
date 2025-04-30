// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, type User } from "firebase/auth";
import { addDoc, collection, doc, getDocs, getFirestore, orderBy, query, where } from "firebase/firestore";
import { getDownloadURL, getStorage, list, ref, uploadBytesResumable, type UploadTask } from "firebase/storage";
import type { FirebaseConcert } from "../../modules/concerts/concertsManager.svelte";
import type { FirebaseNews } from "../../modules/news/newsManager.svelte";
import type { FirebaseGalleryPicture } from "../../modules/gallery/galleryManager.svelte";
import type { FirebaseVideo } from "../../modules/videos/videosManager.svelte";
import type { FirebaseComposition } from "../../modules/compositions/compositionsManager.svelte";
import type { FirebaseAlbum } from "../../modules/discography/discographyManager.svelte";
import { PUBLIC_FIREBASE_API_KEY, PUBLIC_FIREBASE_APP_ID, PUBLIC_FIREBASE_AUTH_DOMAIN, PUBLIC_FIREBASE_MEASUREMENT_ID, PUBLIC_FIREBASE_MESSAGING_SENDER_ID, PUBLIC_FIREBASE_PROJECT_ID, PUBLIC_FIREBASE_STORAGE_BUCKET } from "$env/static/public";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: PUBLIC_FIREBASE_API_KEY,
    authDomain: PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: PUBLIC_FIREBASE_APP_ID,
    measurementId: PUBLIC_FIREBASE_MEASUREMENT_ID
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

    async addConcert(concert: FirebaseConcert) {
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

    async addNews(news: FirebaseNews) {
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

    async addGalleryPicture(picture: FirebaseGalleryPicture) {
        return addDoc(this.#galleryCollection, picture);
    }

    #videosCollection = collection(this.#db, "videos");
    get videosCollection() {
        return this.#videosCollection;
    }

    async getVideos() {
        return getDocs(this.#videosCollection);
    }

    async addVideo(video: FirebaseVideo) {
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

    async addComposition(composition: FirebaseComposition) {
        return addDoc(this.#compositionsCollection, composition);
    }

    #albumsCollection = collection(this.#db, "albums");
    get albumsCollection() {
        return this.#albumsCollection;
    }

    async getAlbums() {
        const q = query(this.#albumsCollection, orderBy("date", "desc"));
        return getDocs(q);
    }

    async addAlbum(album: FirebaseAlbum) {
        return addDoc(this.#albumsCollection, album);
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