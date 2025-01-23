<script lang="ts">

    import { getDownloadURL } from "firebase/storage";
    import { getContext } from "svelte";
    import { compressImageBrowser } from "../../utils/imgUtils";
    import type { FirebaseManager } from "../../firebase/firebaseManager.svelte";
    import ProgressBar from "./ProgressBar.svelte";

    interface Props {
        fullresUrl: string;
        thumbnailUrl: string;
    }

    let { 
        fullresUrl = $bindable(),
        thumbnailUrl = $bindable()
     }: Props = $props();

    let firebaseManager = getContext<() => FirebaseManager | undefined>("firebaseManager")();

    let thumbnailInput: HTMLInputElement | undefined = $state(undefined);
    let thumbnailUploadProgress: number = $state(-1);
    let fullresInput: HTMLInputElement | undefined = $state(undefined);
    let fullresFile: File | null = $state(null);
    let fullresUploadProgress: number = $state(-1);

    let showFullRes: boolean = $state(false);

    export function canGenerateThumbnail() {
        return !!fullresFile;
    }

    export async function autoGenerateThumbnail() {
        if (!fullresFile) return;
        const compressed = await compressImageBrowser(fullresFile);

        return uploadThumbnail(compressed);
    }

    async function uploadThumbnailManually() {
        if (!thumbnailInput) return;

        const file = (thumbnailInput.files as FileList)[0];
        fullresFile = null;

        return uploadThumbnail(file);
    }

    async function uploadThumbnail(file: Blob) {
        if (!firebaseManager) return;

        const uploadTask = firebaseManager.uploadBytesResumable(`gallery/thumbnails/${idBase}-${file.name}`, file);

        return new Promise<string>((resolve, reject) => {
            uploadTask.on("state_changed",
                (snapshot) => {
                    thumbnailUploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                },
                (error) => {
                    console.log(error);
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                        thumbnailUrl = url;
                        thumbnailUploadProgress = -1;

                        resolve(thumbnailUrl);
                    });
                }
            );
        })
    }

    function uploadFullres() {
        if (!firebaseManager || !fullresInput) return;

        const file = (fullresInput.files as FileList)[0];
        fullresFile = file;

        const uploadTask = firebaseManager.uploadBytesResumable(`gallery/fullres/${idBase}-${file.name}`, file);

        uploadTask.on("state_changed",
            (snapshot) => {
                fullresUploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            },
            (error) => {
                console.log(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((imageUrl) => {
                    fullresUrl = imageUrl;
                    fullresUploadProgress = -1;
                });
            }
        );
    }

    const idBase = "image-uploader" + Math.ceil(Math.random() * 10000);
</script>

<div class="uploader-grid">
    <div class="fullres-header">
        <h4>Full resolution image</h4>
        <div class="info">Original quality image, displayed when the image is clicked.</div>
    </div>

    <div class="fullres-preview">
        {#if !fullresUrl}
            <div class="info">Please upload a full resolution image</div>
        {:else if showFullRes}
            <!-- svelte-ignore a11y_img_redundant_alt -->
            <img src={fullresUrl} alt="Image thumbnail" class="thumb-img" />
        {:else}
            <div class="info">The full resolution is hidden in this editor to improve the loading speed of this page but will be shown on the website if the thumbnail is clicked</div>
            <button class="toolbar-button" onclick={() => showFullRes = true}>Show full resolution image</button>
        {/if}
    </div>
    
    <div class="fullres-url">
        <div>
            <a href={fullresUrl} target="_blank" rel="noopener noreferrer">{fullresUrl}</a>
        </div>

        {#if fullresUploadProgress >= 0}
            <div>
                Uploading image
                <ProgressBar progress={fullresUploadProgress} />
            </div>
        {:else}
            <label class="custom-file-upload cta-inverted">
                <input type="file" accept="image/*" bind:this={fullresInput} onchange={uploadFullres} />
                Upload full resolution image
            </label>
        {/if}
    </div>

    <div class="thumb-header">
        <h4>Thumbnail image</h4>
        <div class="info">Lighter image used on the previews to improve loading speed. You can either upload yourself a smaller version of the image, or leave this blank and a compressed image will be generated automatically.</div>
    </div>

    <div class="thumb-preview">
        {#if !thumbnailUrl}
            <div class="info">Please upload or generate a thumbnail image</div>
        {:else}
            <!-- svelte-ignore a11y_img_redundant_alt -->
            <img src={thumbnailUrl} alt="Image thumbnail" class="thumb-img" />
        {/if}
    </div>

    <div class="thumb-url">
        <div>
            <a href={thumbnailUrl} target="_blank" rel="noopener noreferrer">{thumbnailUrl}</a>
        </div>

        {#if thumbnailUploadProgress >= 0}
            <div>
                Uploading thumbnail
                <ProgressBar progress={thumbnailUploadProgress} />
            </div>
        {:else if fullresFile}
            <div>You uploaded a new full resolution image, you can now either</div>

            <div class="thumb-bar">
                <button class="toolbar-button" onclick={autoGenerateThumbnail}>Generate a thumbnail</button>
                <label class="custom-file-upload cta-inverted">
                    <input type="file" accept="image/*" bind:this={thumbnailInput} onchange={uploadThumbnailManually} />
                    Upload a custom thumbnail
                </label>
            </div>
        {:else}
            <label class="custom-file-upload cta-inverted">
                <input type="file" accept="image/*" bind:this={thumbnailInput} onchange={uploadThumbnailManually} />
                Upload a custom thumbnail
            </label>
        {/if}
        <div class="info">Make sure that the thumbnail is roughly a square or that the subject is at the center of the picture</div>
    </div>
</div>

<style>
    .uploader-grid {
        display: grid;
        gap: 1rem 2rem;
        grid-template-areas:
            "fullres-header fullres-header"
            "fullres-preview fullres-url"
            "thumb-header thumb-header"
            "thumb-preview thumb-url";
        
        grid-template-columns: 200px 1fr;
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

    .thumb-preview {
        grid-area: thumb-preview;
    }

    .thumb-img {
        display: block;
        max-width: 100%;
        max-height: 100%;
    }

    .thumb-url {
        grid-area: thumb-url;
    }

    .fullres-url {
        grid-area: fullres-url;
    }

    h4 {
        margin-bottom: 0;
    }
</style>