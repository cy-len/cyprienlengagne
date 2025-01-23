<script lang="ts">
    import {
        type DocumentReference,
        updateDoc,
        getDoc,
        deleteDoc,
    } from "firebase/firestore";
    import {
        getDownloadURL,
    } from "firebase/storage";
    import { onMount, getContext } from "svelte";
    import type { NewsContent } from "../../../types/news";
    import NewsContentEditor from "./NewsContentEditor.svelte";
    import { compressImageBrowser } from "../../../utils/imgUtils";
    import type { FirebaseManager } from "../../../firebase/firebaseManager.svelte";
    import Collapsible from "../Collapsible.svelte";
    import ImageUploader from "../ImageUploader.svelte";

    interface Props {
        newsRef: DocumentReference;
        ondeleted: (id: string) => any;
    }

    let { newsRef, ondeleted }: Props = $props();

    interface EditorNews {
        imageUrl: string;
        thumbnailUrl: string;
        imageCopyright: string;
        dateString: string;
        text: { [key: string]: NewsContent };
    }

    let firebaseManager = getContext<() => FirebaseManager | undefined>("firebaseManager")();

    let news = $state<EditorNews>({
        imageUrl: "",
        thumbnailUrl: "",
        imageCopyright: "",
        text: {},
        dateString: ""
    });

    let hash: string = $state("");

    let imageInput: HTMLInputElement;
    let imageUploadProgress: number = $state(-1);
    let thumbnailUploadProgress: number = $state(-1);

    let basicDetails: Collapsible;
    let imageDetails: Collapsible;
    let contentDetails: Collapsible;

    onMount(async () => {
        const snapshot = await getDoc(newsRef);
        const data = snapshot.data();
        if (!data) return;

        news.dateString = data.date.toDate().toISOString().split("T")[0];
        news.imageUrl = data.imageUrl;
        news.imageCopyright = data.imageCopyright;
        news.text = {
            ...data.text
        };

        hash = JSON.stringify(news);
    });

    async function uploadWithThumbnail(file: File) {
        if (!firebaseManager) return;

        const thumbnail = await compressImageBrowser(file, 1000, 1000);

        const uploadTask = firebaseManager.uploadBytesResumable(`news/image/${idBase}-${file.name}`, file);
        const thumbnailUploadTask = firebaseManager.uploadBytesResumable(`news/image/${idBase}-thumb-${file.name}`, thumbnail);

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
                    news.imageUrl = url;
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
                    news.thumbnailUrl = url;
                    thumbnailUploadProgress = -1;
                });
            },
        );
    }

    function uploadWithoutThumbnail(file: File) {
        if (!firebaseManager) return;

        const uploadTask = firebaseManager.uploadBytesResumable(`news/image/${idBase}-${file.name}`, file);

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
                    news.imageUrl = url;
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
        
        await updateDoc(newsRef, {
            imageUrl: news.imageUrl,
            thumbnailUrl: news.thumbnailUrl,
            imageCopyright: news.imageCopyright,
            date: new Date(news.dateString),
            text: news.text
        });

        hash = JSON.stringify(news);
    }

    async function deleteNews() {
        const areYouSure = prompt(`If you really want to delete ${news.text["en"]?.title ?? news.text["fr"]?.title}, type YES and select ok`);
        if (areYouSure !== "YES") return;

        await deleteDoc(newsRef);
        ondeleted(newsRef.id);
    }

    function expandAll() {
        basicDetails.expand();
        imageDetails.expand();
        contentDetails.expand();
    }

    function collapseAll() {
        basicDetails.collapse();
        imageDetails.collapse();
        contentDetails.collapse();
    }

    const idBase = "" + Math.ceil(Math.random() * 10000);

    let modified: boolean = $derived(hash !== JSON.stringify(news));
</script>

<div class="editor-container" class:modified>
    <header>
        <h3>{news.text["en"]?.title ?? news.text["fr"]?.title ?? "New news item"} ({ (new Date(news.dateString)).toLocaleDateString() })</h3>
        {#if modified}
            <div class="info">Has unsaved changes</div>
        {/if}

        <div class="bar">
            <button class="toolbar-button" onclick={expandAll}>Expand</button>
            <button class="toolbar-button" onclick={collapseAll}>Collapse</button>
            {#if modified}
                <button class="toolbar-button" onclick={save}>Save modifications</button>
            {/if}
            <button class="toolbar-button red" onclick={deleteNews}>Delete news item</button>
        </div>
    </header>

    <Collapsible summaryText="Basic details" bind:this={basicDetails}>
        <label for="{idBase}-date" class="date-label">Publication date</label>
        <input
            type="date"
            id="{idBase}-date"
            class="date-field"
            bind:value={news.dateString}
        />
    </Collapsible>

    <Collapsible summaryText="Image" bind:this={imageDetails}>
        <ImageUploader bind:fullresUrl={news.imageUrl} bind:thumbnailUrl={news.thumbnailUrl} />
    </Collapsible>

    <Collapsible summaryText="Article content" bind:this={contentDetails}>
        {#each Object.keys(news.text) as lang}
            <NewsContentEditor langName={lang} text={news.text[lang]} />
        {/each}
    </Collapsible>
</div>
