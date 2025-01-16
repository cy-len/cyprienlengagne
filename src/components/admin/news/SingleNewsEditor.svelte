<script lang="ts">
    import {
        type DocumentReference,
        updateDoc,
        getDoc,
        deleteDoc,
    } from "firebase/firestore";
    import {
        ref,
        type FirebaseStorage,
        uploadBytesResumable,
        getDownloadURL,
    } from "firebase/storage";
    import { onMount, createEventDispatcher } from "svelte";
    import type { NewsContent } from "../../../types/news";
    import NewsContentEditor from "./NewsContentEditor.svelte";
    import { compressImageBrowser } from "../../../utils/imgUtils";

    const dispatch = createEventDispatcher();

    export let newsRef: DocumentReference;

    let storageCopy: FirebaseStorage | null = null;

    let imageUrl: string = "";
    let thumbnailUrl: string = "";
    let imageCopyright: string = "";
    let text: { [key: string]: NewsContent } = {};
    let dateString: string = "";

    let hash: string = "";

    let imageInput: HTMLInputElement;
    let imageUploadProgress: number = -1;
    let thumbnailUploadProgress: number = -1;

    function getHash(): string {
        let h = imageUrl + imageCopyright + dateString;

        Object.values(text).forEach((v) => {
            h += v.title + v.content;
        });

        return h;
    }

    onMount(async () => {
        const { storage } = await import("../../../firebase");

        storageCopy = storage;

        const snapshot = await getDoc(newsRef);
        const data = snapshot.data();
        if (!data) return;

        imageUrl = data.imageUrl;
        text = {
            ...data.text,
        };
        imageCopyright = data.imageCopyright;
        dateString = data.date.toDate().toISOString().split("T")[0];

        hash = getHash();
    });

    async function uploadWithThumbnail(file: File) {
        if (!storageCopy) return;

        const thumbnail = await compressImageBrowser(file, 1000, 1000);

        const cloudFileName = `news/image/${idBase}-${file.name}`;
        const cloudRef = ref(storageCopy, cloudFileName);

        const cloudThumbnailFileName = `news/image/${idBase}-thumb-${file.name}`;
        const cloudThumbnailRef = ref(storageCopy, cloudThumbnailFileName);

        const uploadTask = uploadBytesResumable(cloudRef, file);
        const thumbnailUploadTask = uploadBytesResumable(cloudThumbnailRef, thumbnail);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                imageUploadProgress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            },
            (error) => {
                console.log(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    imageUrl = url;
                    imageUploadProgress = -1;
                });
            },
        );

        thumbnailUploadTask.on(
            "state_changed",
            (snapshot) => {
                thumbnailUploadProgress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            },
            (error) => {
                console.log(error);
            },
            () => {
                getDownloadURL(thumbnailUploadTask.snapshot.ref).then((url) => {
                    thumbnailUrl = url;
                    thumbnailUploadProgress = -1;
                });
            },
        );
    }

    function uploadWithoutThumbnail(file: File) {
        if (!storageCopy) return;
        
        const cloudFileName = `news/image/${idBase}-${file.name}`;
        const cloudRef = ref(storageCopy, cloudFileName);

        const uploadTask = uploadBytesResumable(cloudRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                imageUploadProgress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            },
            (error) => {
                console.log(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    imageUrl = url;
                    imageUploadProgress = -1;
                });
            },
        );
    }

    function uploadImage() {
        const file = (imageInput.files as FileList)[0];

        if (file.size > 50_000) { // auto compress if greater than 50kb
            uploadWithThumbnail(file);
        } else {
            uploadWithoutThumbnail(file);
        }
    }

    export async function save() {
        if (!modified) return;

        const data = {
            imageUrl,
            imageCopyright,
            thumbnailUrl,
            text: {
                ...text,
            },
            date: new Date(dateString),
        };
        console.log(data);
        await updateDoc(newsRef, data);
        hash = getHash();
    }

    async function deleteNews() {
        const areYouSure = prompt(`If you really want to delete ${text["en"]?.title ?? text["fr"]?.title}, type YES and select ok`);
        if (areYouSure !== "YES") return;

        await deleteDoc(newsRef);
        dispatch("deleted", {
            id: newsRef.id,
        });
    }

    const idBase = "" + Math.ceil(Math.random() * 10000);

    let modified: boolean = false;

    $: {
        let h = imageUrl + imageCopyright + dateString;

        Object.values(text).forEach((v) => {
            h += v.title + v.content;
        });
        modified = hash !== h;
    }
</script>

<div class="editor-container" class:modified>
    <div class="editor-grid">
        <!-- svelte-ignore a11y-img-redundant-alt -->
        <img src={imageUrl} alt="Image thumbnail" class="img" />

        <div class="url">
            <div>{imageUrl}</div>
            {#if imageUploadProgress >= 0}
                <div>
                    <span>
                        Uploading image {imageUploadProgress}% 
                    </span>
                    {#if thumbnailUploadProgress >= 0}
                        <span>(Uploading thumbnail {thumbnailUploadProgress}%)</span>
                    {/if}
                </div>
            {:else}
                <label class="custom-file-upload cta-inverted">
                    <input
                        type="file"
                        accept="image/*"
                        bind:this={imageInput}
                        on:change={uploadImage}
                    />
                    Upload image
                </label>
            {/if}
        </div>

        <label for="{idBase}-copyright" class="copyright-label">Copyright</label>
        <input
            type="text"
            id="{idBase}-copyright"
            class="copyright-field"
            bind:value={imageCopyright}
        />

        <label for="{idBase}-date" class="date-label">Date</label>
        <input
            type="date"
            id="{idBase}-date"
            class="date-field"
            bind:value={dateString}
        />

        <div class="texts">
            {#each Object.keys(text) as lang}
                <NewsContentEditor langName={lang} text={text[lang]} />
            {/each}
        </div>

        <div class="delete-button">
            <button class="toolbar-button" on:click={deleteNews}>Delete news</button>
        </div>
    </div>
</div>

<style>
    .editor-grid {
        grid-template-areas:
            "img url delete-button"
            "img copyright-label delete-button"
            "img copyright-field delete-button"
            "img date-label delete-button"
            "img date-field delete-button"
            "texts texts delete-button";

        grid-template-columns: 200px 1fr 10rem;
        grid-template-rows: repeat(min-content);
    }

    .custom-file-upload {
        display: inline-block;
        margin: 0.5rem 0;
        padding: 0.25rem;
        border-radius: 0.5rem;
        cursor: pointer;
    }

    input[type="file"] {
        display: none;
    }

    .img {
        grid-area: img;
        display: block;
        max-width: 100%;
        max-height: 100%;
    }

    .url {
        grid-area: url;
    }

    .copyright-label {
        grid-area: copyright-label;
    }

    .copyright-field {
        grid-area: copyright-field;
    }

    .date-label {
        grid-area: date-label;
    }

    .date-field {
        grid-area: date-field;
    }

    .texts {
        grid-area: texts;
    }
</style>
