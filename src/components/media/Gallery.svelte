<script lang="ts">
    import GalleryModal from "../../components/modals/GalleryModal.svelte";
    import { gallery, type GalleryPicture } from "../../stores/gallery";
    import { Status } from "../../types/status";
    import LoadingSpinner from "../../components/utils/LoadingSpinner.svelte";

    export let loadingText: string = "Loading gallery";

    let modal: GalleryModal;

    function openFullPicture(p: GalleryPicture) {
        modal.show(p);
    }

</script>

{#if $gallery.status === Status.PENDING}
    <LoadingSpinner message={loadingText} />
{:else}
    <div class="gallery auto-grid">
        {#each $gallery.pictures as picture}
            <button class="gallery-item" tabindex="0" on:click={() => {openFullPicture(picture);}}>
                <img src={picture.thumbnailUrl} alt="Cyprien Lengagne" class="gallery-image" />
                <div class="gallery-image-copyright bg-very-light">&#169; { picture.copyright }</div>
            </button>
        {/each}
    </div>
    <GalleryModal bind:this={modal} />
{/if}

<style>

    .gallery {
        --thumb-max-size: 25rem;
        --cell-width: min(var(--thumb-max-size), 90vw);
        --cell-height: var(--thumb-max-size);
    }

    .gallery-item {
        position: relative;
        display: block;
        outline: none;
        padding: 0;
        overflow: hidden;
        cursor: pointer;

        border-radius: 0.5rem;

        transition: 0.25s ease-out;
    }

    .gallery-item:hover {
        filter: brightness(0.5);
        border-radius: 0;
    }

    .gallery-item:hover .gallery-image {
        transform: scale(1.1);
    }

    .gallery-item:hover .gallery-image-copyright {
        transform: translateY(100%);
    }

    .gallery-image {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;

        transition: 0.25s ease-out;
    }
    
    .gallery-image-copyright {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0.25rem;

        transition: 0.25s ease-out;
    }

</style>