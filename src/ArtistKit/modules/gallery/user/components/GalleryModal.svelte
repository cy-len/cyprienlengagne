<script lang="ts">
    import type { ArtkytImage } from "../../../../../artkyt/types";
    import LazyImage from "../../../../core/components/images/LazyImage.svelte";
    import LoadingSpinner from "../../../../core/components/LoadingSpinner.svelte";
    import Modal from "../../../../core/components/Modal.svelte";


    let modal: Modal;

    let picture: ArtkytImage = $state({
        credits: "",
        originalQualityUrl: ""
    });

    let loading: boolean = $state(true);

    export function show(galleryPicture: ArtkytImage) {
        modal.show();
        picture = galleryPicture;
    }

    async function downloadPicture() {
        const response = await fetch(picture.originalQualityUrl);
        const blob = await response.blob();

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.style.display = "none";
        a.download = "Cyprien_Lengagne";

        document.body.appendChild(a);
        a.click();
        a.remove();
    }

</script>

<Modal bind:this={modal}>
     {#snippet leftButton()}
        <button class="soft-button" onclick={downloadPicture}>
            <img class="icon" src="/icons/download.svg" alt="Download" />
        </button>
     {/snippet}

     <div class="wrapper">
        <LazyImage lowresSrc={picture.thumbnailUrl} src={picture.highQualityUrl ?? picture.originalQualityUrl} alt={picture.credits} observe={false} onFullResLoaded={() => loading = false} />
        {#if loading}
            <div class="loading-wrapper">
                <LoadingSpinner message="Loading full resolution picture" />
            </div>
        {/if}
     </div>

    <div class="copyright">
        &#169; { picture.credits }
    </div>
</Modal>

<style>

    .wrapper {
        position: relative;
    }

    .wrapper :global(.lazy-image) {
        max-width: 90vw;
        max-height: 70vh;
    }

    .loading-wrapper {
        position: absolute;
        inset: 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }

</style>