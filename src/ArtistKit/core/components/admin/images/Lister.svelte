<script lang="ts">

    import { getDownloadURL, type StorageReference } from "firebase/storage";
    import { getContext } from "svelte";
    import { FirebaseManager } from "../../../libs/firebaseManager.svelte";
    import LoadingSpinner from "../../LoadingSpinner.svelte";

    interface Props {
        folderPath: string;

        onImageSelected: (image: FirebaseImage) => void;
    }

    let { 
        folderPath,
        onImageSelected
     }: Props = $props();

    let firebaseManager = getContext<() => FirebaseManager | undefined>("firebaseManager")();

    interface FirebaseImage {
        url: string;
        ref: StorageReference;
    }

    let images: FirebaseImage[] = $state([]);
    let loading: boolean = $state(true);

    async function loadImages(path: string) {
        if (!firebaseManager) return;
        loading = true;

        const listing = await firebaseManager.listFilesInFolder(path);

        const promises = listing.items.map(async (ref) => {
            const url = await getDownloadURL(ref)
            return {
                url,
                ref
            };
        });
        images = await Promise.all(promises);

        loading = false;
    }

    $effect(() => {
        loadImages(folderPath);
    });
</script>

<div class="lister">
    {#if loading}
        <div class="loading-spinner-wrapper">
            <LoadingSpinner message="Loading images" />
        </div>
    {:else}
        <div class="lister-grid">
            {#each images as image, i}
                <button onclick={() => { onImageSelected(image); }}>
                    <img src={image.url} alt={image.ref.name} loading={i > 6 ? "lazy" : "eager"} />
                </button>
            {:else}
                <p>No images</p>
            {/each}
        </div>
    {/if}
</div>

<style>

    .lister-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, 12rem);
        gap: 1rem;
        height: 25rem;
        overflow: auto;
    }

    .loading-spinner-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    button {
        display: block;
        padding: 0.25rem;
    }

    img {
        display: block;
        width: 100%;
        object-fit: contain;
    }

</style>