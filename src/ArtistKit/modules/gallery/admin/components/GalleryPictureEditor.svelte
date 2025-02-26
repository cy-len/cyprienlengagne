<script lang="ts">
    import {
        type DocumentReference,
        updateDoc,
        getDoc,
        deleteDoc,
    } from "firebase/firestore";
    import { onMount } from "svelte";
    import Collapsible from "../../../../core/components/Collapsible.svelte";
    import FormLabel from "../../../../core/components/forms/FormLabel.svelte";
    import ImagePicker from "../../../../core/components/admin/images/ImagePicker.svelte";
    
    interface Props {
        pictureRef: DocumentReference;
        ondeleted: (id: string) => any;
    }

    let { pictureRef, ondeleted }: Props = $props();

    interface EditorGalleryPicture {
        url: string;
        thumbnailUrl: string;
        xOffset: number;
        yOffset: number;
        copyright: string;
        date: Date;
    }

    let galleryPicture = $state<EditorGalleryPicture>({
        url: "",
        thumbnailUrl: "",
        xOffset: 0,
        yOffset: 0,
        copyright: "",
        date: new Date(),
    });

    let hash: string = $state("");

    let basicDetails: Collapsible;
    let imageDetails: Collapsible;

    onMount(async () => {
        const snapshot = await getDoc(pictureRef);
        const data = snapshot.data();
        if (!data) return;

        galleryPicture.url = data.url;
        galleryPicture.thumbnailUrl = data.thumbnailUrl;
        galleryPicture.copyright = data.copyright;
        galleryPicture.date = data.uploadedDate.toDate();
        galleryPicture.xOffset = data.thumbnailXOffset ?? 50;
        galleryPicture.yOffset = data.thumbnailYOffset ?? 50;

        hash = JSON.stringify(galleryPicture);
    });

    export async function save() {
        if (!modified) return;

        await updateDoc(pictureRef, {
            copyright: galleryPicture.copyright,
            date: galleryPicture.date,
            url: galleryPicture.url,
            thumbnail: {
                url: galleryPicture.thumbnailUrl,
                offset: {
                    x: galleryPicture.xOffset,
                    y: galleryPicture.yOffset
                }
            }
        });

        hash = JSON.stringify(galleryPicture);
    }

    async function deletePicture() {
        const areYouSure = prompt(
            `If you really want to delete this image, type YES and select ok`,
        );
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

    let modified = $derived(hash !== JSON.stringify(galleryPicture));
</script>

<div class="editor-container" class:modified>
    <header>
        <h3>
            {galleryPicture.copyright ?? "New gallery picture"} 
            (uploaded on {new Date(galleryPicture.date,).toLocaleDateString()})
        </h3>
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
        <FormLabel name="Copyright">
            <input type="text" bind:value={galleryPicture.copyright} />
        </FormLabel>
    </Collapsible>

    <Collapsible summaryText="Image" bind:this={imageDetails}>
        <ImagePicker
            bind:fullresUrl={galleryPicture.url}
            bind:thumbnailUrl={galleryPicture.thumbnailUrl}
            folderPath="gallery"
            allowPickFromFolders={[]}
            cropContainerThumbnail={{ width: 1, height: 1 }}
            bind:thumbnailXOffset={galleryPicture.xOffset}
            bind:thumbnailYOffset={galleryPicture.yOffset}
        />
    </Collapsible>
</div>
