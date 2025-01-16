<script lang="ts">

    import { type DocumentReference, updateDoc, getDoc, deleteDoc } from "firebase/firestore";
    import { ref, type FirebaseStorage, uploadBytesResumable, getDownloadURL } from "firebase/storage";
    import { onMount, createEventDispatcher } from "svelte";
    import { compressImageBrowser } from "../../utils/imgUtils";

    const dispatch = createEventDispatcher();

    export let pictureRef: DocumentReference;

    let storageCopy: FirebaseStorage | null = null;

    let url: string = "";
    let thumbnailUrl: string = "";
    let copyright: string = "";
    let date: Date = new Date();

    let hash: string = "";

    let thumbnailInput: HTMLInputElement;
    let thumbnailUploadProgress: number = -1;
    let fullresInput: HTMLInputElement;
    let fullresFile: File | null = null;
    let fullresUploadProgress: number = -1;

    let showFullRes: boolean = false;

    onMount(async () => {
        const { storage }  = await import("../../firebase");

        storageCopy = storage;

        const snapshot = await getDoc(pictureRef);
        const data = snapshot.data();
        if (!data) return;

        url = data.url;
        thumbnailUrl = data.thumbnailUrl;
        copyright = data.copyright;
        date = data.uploadedDate.toDate();

        hash = url + thumbnailUrl + copyright;
    });

    async function autoGenerateThumbnail() {
        if (!fullresFile) return;
        const compressed = await compressImageBrowser(fullresFile);
        
        return uploadThumbnail(compressed);
    }

    async function uploadThumbnailManually() {
        const file = (thumbnailInput.files as FileList)[0];
        fullresFile = null;

        return uploadThumbnail(file);
    }

    async function uploadThumbnail(file: Blob) {
        if (!storageCopy) return;

        const cloudFileName = `gallery/thumbnails/${idBase}-${file.name}`;
        const cloudRef = ref(storageCopy, cloudFileName);

        const uploadTask = uploadBytesResumable(cloudRef, file);

        uploadTask.on("state_changed",
            (snapshot) => {
                thumbnailUploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            },
            (error) => {
                console.log(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    thumbnailUrl = url;
                    thumbnailUploadProgress = -1;
                });
            }
        );
    }

    function uploadFullres() {
        if (!storageCopy) return;

        const file = (fullresInput.files as FileList)[0];
        fullresFile = file;

        const cloudFileName = `gallery/fullres/${idBase}-${file.name}`;
        const cloudRef = ref(storageCopy, cloudFileName);

        const uploadTask = uploadBytesResumable(cloudRef, file);

        uploadTask.on("state_changed",
            (snapshot) => {
                fullresUploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            },
            (error) => {
                console.log(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((imageUrl) => {
                    url = imageUrl;
                    fullresUploadProgress = -1;
                });
            }
        );
    }

    export async function save() {
        if (!modified) return;

        if (!thumbnailUrl) {
            alert(`The image ${copyright}, uploaded on ${date.toLocaleDateString()}, does not have a thumbnail. An auto-generated thumbnail will be used`);
            await autoGenerateThumbnail();
        }

        const data = {
            thumbnailUrl,
            url,
            copyright,
            date
        };
        await updateDoc(pictureRef, data);
        hash = url + thumbnailUrl + copyright;
    }

    async function deletePicture() {
        const areYouSure = prompt(`If you really want to delete this image, type YES and select ok`);
        if (areYouSure !== "YES") return;

        await deleteDoc(pictureRef);
        dispatch("deleted", {
            ref: pictureRef
        });
    }

    const idBase = "" + Math.ceil(Math.random() * 10000);

    $: modified = hash !== (url + thumbnailUrl + copyright);
</script>

<div class="editor-container" class:modified={modified}>
    <div class="editor-grid">
        <div class="copyright">
            <label for="{idBase}-copyright" class="copyright-label">Copyright</label>
            <input type="text" id="{idBase}-copyright" class="copyright-field" bind:value={copyright} />
        </div>
    
        <div class="uploaded">
            Uploaded on <br />
            { date.toLocaleDateString() }
        </div>

        <div class="fullres-header">
            <h4>Full resolution image</h4>
            <div class="info">Original quality image, displayed when the image is clicked.</div>
        </div>

        <div class="fullres-preview">
            {#if !url}
                <div class="info">Please upload a full resolution image</div>
            {:else if showFullRes}
                <!-- svelte-ignore a11y-img-redundant-alt -->
                <img src={url} alt="Image thumbnail" class="thumb-img" />
            {:else}
                <div class="info">The full resolution is hidden in this editor to improve the loading speed of this page but will be shown on the website if the thumbnail is clicked</div>
                <button class="toolbar-button" on:click={() => showFullRes = true}>Show full resolution image</button>
            {/if}
        </div>
        
        <div class="url">
            <div>
                <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
            </div>

            {#if fullresUploadProgress >= 0}
                <div>Uploading image ({fullresUploadProgress}%)</div>
            {:else}
                <label class="custom-file-upload cta-inverted">
                    <input type="file" accept="image/*" bind:this={fullresInput} on:change={uploadFullres} />
                    Upload full resolution image
                </label>
            {/if}
        </div>

        <div class="thumb-header">
            <h4>Thumbnail image</h4>
            <div class="info">Lighter image used on the gallery to improve loading speed. You can either upload yourself a smaller version of the image, or leave this blank and a compressed image will be generated automatically.</div>
        </div>

        <!-- svelte-ignore a11y-img-redundant-alt -->
        <img src={thumbnailUrl} alt="Image thumbnail" class="thumb-img" />
    
        <div class="thumb-url">
            <div>
                <a href={thumbnailUrl} target="_blank" rel="noopener noreferrer">{thumbnailUrl}</a>
            </div>

            {#if thumbnailUploadProgress >= 0}
                <div>Uploading thumbnail ({thumbnailUploadProgress}%)</div>
            {:else if fullresFile}
                <div>You uploaded a new full resolution image, you can now either</div>

                <div class="thumb-bar">
                    <button class="toolbar-button" on:click={autoGenerateThumbnail}>Generate a thumbnail</button>
                    <label class="custom-file-upload cta-inverted">
                        <input type="file" accept="image/*" bind:this={thumbnailInput} on:change={uploadThumbnailManually} />
                        Upload a custom thumbnail
                    </label>
                </div>
            {:else}
                <label class="custom-file-upload cta-inverted">
                    <input type="file" accept="image/*" bind:this={thumbnailInput} on:change={uploadThumbnailManually} />
                    Upload a custom thumbnail
                </label>
            {/if}
            <div class="info">Make sure that the thumbnail is roughly a square or that the subject is at the center of the picture</div>
        </div>
    
        <div class="delete-button">
            <button class="toolbar-button" on:click={deletePicture}>Delete picture</button>
        </div>
    </div>
</div>

<style>
    .editor-grid {
        grid-template-areas:
            "copyright copyright uploaded delete-button"
            "fullres-header fullres-header fullres-header delete-button"
            "fullres-preview url url delete-button"
            "thumb-header thumb-header thumb-header delete-button"
            "thumb-img thumb-url thumb-url delete-button";
        
        grid-template-columns: 200px 1fr 1fr 10rem;
        grid-template-rows: min-content min-content min-content min-content min-content;
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

    .fullres-header {
        grid-area: fullres-header;
    }

    .fullres-preview {
        grid-area: fullres-preview;
    }

    .thumb-header {
        grid-area: thumb-header;
    }

    .thumb-img {
        grid-area: thumb-img;
        display: block;
        max-width: 100%;
        max-height: 100%;
    }

    .thumb-url {
        grid-area: thumb-url;
    }

    .url {
        grid-area: url;
    }

    .copyright {
        grid-area: copyright;
    }

    .uploaded {
        grid-area: uploaded;
    }

    .info {
        font-style: italic;
        font-size: 0.8rem;
    }

    h4 {
        margin-bottom: 0;
    }
</style>