<script lang="ts">
    import { slide } from "svelte/transition";
    import BasicUploader from "./BasicUploader.svelte";
    import Lister from "./Lister.svelte";
    import type { StorageReference } from "firebase/storage";
    import { getContext } from "svelte";
    import type { FirebaseManager } from "../../../firebase/firebaseManager.svelte";
    import ThumbnailCrop from "./ThumbnailCrop.svelte";

    interface Folder {
        displayName: string;
        path: string;
    }

    interface Props {
        fullresUrl: string;
        thumbnailUrl: string;

        folderPath: string;

        allowPickFromFolders: Folder[];

        cropContainerThumbnail?: {
            width: number;
            height: number;
        };
        thumbnailXOffset?: number;
        thumbnailYOffset?: number;

        cropContainerFullres?: {
            width: number;
            height: number;
        };
        fullresXOffset?: number;
        fullresYOffset?: number;
    }

    let {
        fullresUrl = $bindable(),
        thumbnailUrl = $bindable(),
        folderPath,
        allowPickFromFolders = [],
        cropContainerThumbnail,
        thumbnailXOffset = $bindable(50),
        thumbnailYOffset = $bindable(50),
        cropContainerFullres,
        fullresXOffset = $bindable(50),
        fullresYOffset = $bindable(50)
    }: Props = $props();

    let listerFolder = $state<Folder | null>(null);

    let firebaseManager = getContext<() => FirebaseManager | undefined>("firebaseManager")();

    async function existingPictureChosen(img: { url: string; ref: StorageReference }) {
        if (!firebaseManager) return;

        fullresUrl = await firebaseManager.getDownloadUrlFromPath(img.ref.fullPath.replace("thumbnails", "fullres"));
        thumbnailUrl = img.url;

        listerFolder = null;
    }

</script>

<div class="image-picker">
    <div class="selector">
        <div class="selector-bar">
            <BasicUploader bind:fullresUrl={fullresUrl} bind:thumbnailUrl={thumbnailUrl} {folderPath} uploadText="Upload a new image" />
            {#each allowPickFromFolders as folder}
                <button class="cta force-white-bg" onclick={() => listerFolder = folder}>Pick from { folder.displayName }</button>
            {/each}
            {#if fullresUrl || thumbnailUrl}
                <button class="cta-inverted red" onclick={() => { fullresUrl = ""; thumbnailUrl = ""; }}>Remove image</button>
            {/if}
        </div>

        {#if listerFolder}
            <div class="lister" transition:slide={{ duration: 250 }}>
                <div class="lister-bar">
                    <h4>{ listerFolder.displayName }</h4>
                    <button class="cta-inverted" onclick={() => listerFolder = null}>Close</button>
                </div>

                <Lister folderPath="{listerFolder.path}/thumbnails" onImageSelected={existingPictureChosen} />
            </div>
        {/if}
    </div>

    <div class="preview-crop">
        <div>
            {#if thumbnailUrl}
                {#if cropContainerThumbnail}
                    <ThumbnailCrop imageTitle="Thumbnail" {thumbnailUrl} aspectRatioWidth={cropContainerThumbnail.width} aspectRatioHeight={cropContainerThumbnail.height} bind:xOffset={thumbnailXOffset} bind:yOffset={thumbnailYOffset} />
                {:else}
                    <img src={thumbnailUrl} alt="Thumbnail preview" />
                {/if}
            {:else}
                <div>No thumbnail</div>
            {/if}
        </div>

        <div>
            {#if fullresUrl}
                {#if cropContainerFullres}
                    <ThumbnailCrop imageTitle="Full resolution image" thumbnailUrl={thumbnailUrl ?? fullresUrl} aspectRatioWidth={cropContainerFullres.width} aspectRatioHeight={cropContainerFullres.height} bind:xOffset={fullresXOffset} bind:yOffset={fullresYOffset} />
                {/if}
                <div class="preview-bar">
                    <a href={fullresUrl} class="cta force-white-bg" target="_blank">See full res. image</a>
                </div>
            {:else}
                <div>No image</div>
            {/if}
        </div>
    </div>
</div>

<style>

    img {
        display: block;
        width: 100%;
    }

    a.cta {
        display: block;
    }

    .preview-bar {
        display: flex;
        margin-top: 0.5rem;
    }

    .lister {
        margin-top: 1rem;
    }

    .lister-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .selector {
        grid-area: selector;
    }

    .selector-bar {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
    }

    .preview-crop {
        margin-top: 1rem;

        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
    }

    h4 {
        margin: 0;
    }

</style>