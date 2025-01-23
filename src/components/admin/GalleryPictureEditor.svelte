<script lang="ts">

    import { type DocumentReference, updateDoc, getDoc, deleteDoc } from "firebase/firestore";
    import { onMount } from "svelte";
    import Collapsible from "./Collapsible.svelte";
    import ImageUploader from "./ImageUploader.svelte";

    interface Props {
        pictureRef: DocumentReference;
        ondeleted: (id: string) => any;
    }

    let { pictureRef, ondeleted }: Props = $props();

    interface EditorGalleryPicture {
        url: string;
        thumbnailUrl: string;
        copyright: string;
        date: Date;
    }

    let galleryPicture = $state<EditorGalleryPicture>({
        url: "",
        thumbnailUrl: "",
        copyright: "",
        date: new Date()
    });

    let hash: string = $state("");

    let basicDetails: Collapsible;
    let imageDetails: Collapsible;

    let imageUploader: ImageUploader;

    onMount(async () => {
        const snapshot = await getDoc(pictureRef);
        const data = snapshot.data();
        if (!data) return;

        galleryPicture.url = data.url;
        galleryPicture.thumbnailUrl = data.thumbnailUrl;
        galleryPicture.copyright = data.copyright;
        galleryPicture.date = data.uploadedDate.toDate();

        hash = JSON.stringify(galleryPicture);
    });

    export async function save() {
        if (!modified) return;

        if (!galleryPicture.thumbnailUrl) {
            if (!imageUploader.canGenerateThumbnail()) {
                alert(`The image ${galleryPicture.copyright}, uploaded on ${galleryPicture.date.toLocaleDateString()}, does not have a thumbnail. Please upload one for the gallery item to display properly`);
            } else {
                alert(`The image ${galleryPicture.copyright}, uploaded on ${galleryPicture.date.toLocaleDateString()}, does not have a thumbnail. An auto-generated thumbnail will be used`);
                await imageUploader.autoGenerateThumbnail();
            }
        }

        await updateDoc(pictureRef, {
            copyright: galleryPicture.copyright,
            date: galleryPicture.date,
            url: galleryPicture.url,
            thumbnailUrl: galleryPicture.thumbnailUrl,
        });

        hash = JSON.stringify(galleryPicture);
    }

    async function deletePicture() {
        const areYouSure = prompt(`If you really want to delete this image, type YES and select ok`);
        if (areYouSure !== "YES") return;

        await deleteDoc(pictureRef);
        ondeleted(pictureRef.id);
    }

    function expandAll() {
        basicDetails.expand();
        imageDetails.expand();
    }

    function collapseAll() {
        basicDetails.collapse();
        imageDetails.collapse();
    }

    const idBase = "gallery-picture-editor" + Math.ceil(Math.random() * 10000);

    let modified = $derived(hash !== JSON.stringify(galleryPicture));
</script>

<div class="editor-container" class:modified={modified}>
    <header>
        <h3>{ galleryPicture.copyright ?? "New gallery picture" } (uploaded on { (new Date(galleryPicture.date)).toLocaleDateString() })</h3>
        {#if modified}
            <div class="info">Has unsaved changes</div>
        {/if}

        <div class="bar">
            <button class="toolbar-button" onclick={expandAll}>Expand</button>
            <button class="toolbar-button" onclick={collapseAll}>Collapse</button>
            {#if modified}
                <button class="toolbar-button" onclick={save}>Save modifications</button>
            {/if}
            <button class="toolbar-button red" onclick={deletePicture}>Delete picture</button>
        </div>
    </header>

    <Collapsible summaryText="Basic infos" bind:this={basicDetails}>
        <div class="copyright">
            <label for="{idBase}-copyright" class="copyright-label">Copyright</label>
            <input type="text" id="{idBase}-copyright" class="copyright-field" bind:value={galleryPicture.copyright} />
        </div>
    </Collapsible>

    <Collapsible summaryText="Image" bind:this={imageDetails}>
        <ImageUploader bind:fullresUrl={galleryPicture.url} bind:thumbnailUrl={galleryPicture.thumbnailUrl} bind:this={imageUploader} />
    </Collapsible>
</div>

<style>
</style>