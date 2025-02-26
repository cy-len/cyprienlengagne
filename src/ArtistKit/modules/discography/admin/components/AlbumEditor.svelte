<script lang="ts">
    import { type DocumentReference, updateDoc, getDoc, deleteDoc } from "firebase/firestore";
    import { onMount } from "svelte";
    import type { Recording } from "../../../../core/types/recording";
    import Collapsible from "../../../../core/components/Collapsible.svelte";
    import FormLabel from "../../../../core/components/forms/FormLabel.svelte";
    import MultilingualEditor from "../../../../core/components/admin/MultilingualEditor.svelte";
    import ImagePicker from "../../../../core/components/admin/images/ImagePicker.svelte";
    import RecordingsEditor from "../../../../core/components/admin/RecordingsEditor.svelte";
    
    interface Props {
        albumRef: DocumentReference;
        ondeleted: (id: string) => any;
    }

    interface FirebaseAlbum {
        title: string;
        subtitle: string;
        date: Date;
        description: string;
        lingualDescriptions: { [key: string]: string };
        buyUrl?: string;
        imgUrl: string;
        thumbnailUrl: string;
        recordings: Recording[];
    }

    interface EditorAlbum {
        title: string;
        subtitle: string;
        dateString: string;
        description: string;
        lingualDescriptions: { [key: string]: string };
        buyUrl?: string;
        imgUrl: string;
        thumbnailUrl: string;
        recordings: Recording[];
    }

    let { albumRef, ondeleted }: Props = $props();

    let album = $state<EditorAlbum>({
        title: "",
        subtitle: "",
        dateString: (new Date()).toISOString().split("T")[0],
        description: "",
        lingualDescriptions: {},
        buyUrl: "",
        imgUrl: "",
        thumbnailUrl: "",
        recordings: []
    });

    let hash: string = $state("");

    let basicDetails: Collapsible;
    let descriptionDetails: Collapsible;
    let imageDetails: Collapsible;
    let recordingsDetails: Collapsible;

    onMount(async () => {
        const snapshot = await getDoc(albumRef);
        const data = snapshot.data();
        if (!data) return;

        album.title = data.title;
        album.subtitle = data.subtitle;
        album.dateString = data.date.toDate().toISOString().split("T")[0];
        album.description = data.description;
        album.lingualDescriptions = data.lingualDescriptions ?? {};
        album.buyUrl = data.buyUrl;
        album.imgUrl = data.imgUrl;
        album.thumbnailUrl = data.thumbnailUrl;
        album.recordings = data.recordings;

        hash = JSON.stringify(album);
    });

    export async function save() {
        if (!modified) return;

        const data: FirebaseAlbum = {
            title: album.title,
            subtitle: album.subtitle,
            date: new Date(album.dateString),
            description: album.description,
            lingualDescriptions: album.lingualDescriptions,
            buyUrl: album.buyUrl,
            imgUrl: album.imgUrl,
            thumbnailUrl: album.thumbnailUrl,
            recordings: album.recordings,
        };

        await updateDoc(albumRef, data as any);

        hash = JSON.stringify(album);
    }

    async function deleteConcert() {
        const areYouSure = prompt(`If you really want to delete the album ${album.title}, type YES and select ok`);
        if (areYouSure !== "YES") return;

        await deleteDoc(albumRef);
        ondeleted(albumRef.id);
    }

    function expandAll() {
        basicDetails.expand();
        descriptionDetails.expand();
        imageDetails.expand();
        recordingsDetails.expand();
    }

    function collapseAll() {
        basicDetails.collapse();
        descriptionDetails.collapse();
        imageDetails.collapse();
        recordingsDetails.collapse();
    }

    let modified = $derived(hash !== JSON.stringify(album));
</script>

<div class="editor-container" class:modified={modified}>
    <header>
        <h3>{album.title || "New album"}</h3>
        {#if modified}
            <div class="info">Has unsaved changes</div>
        {/if}

        <div class="bar">
            <button class="toolbar-button" onclick={expandAll}>Expand</button>
            <button class="toolbar-button" onclick={collapseAll}>Collapse</button>
            {#if modified}
                <button class="toolbar-button" onclick={save}>Save modifications</button>
            {/if}
            <button class="toolbar-button red" onclick={deleteConcert}>Delete album</button>
        </div>
    </header>

    <Collapsible summaryText="Basic details" bind:this={basicDetails}>
        <FormLabel name="Title">
            <input type="text" bind:value={album.title} />
        </FormLabel>
        <FormLabel name="Subtitle (optional)">
            <input type="text" bind:value={album.subtitle} />
        </FormLabel>
        <FormLabel name="Date">
            <input type="date" bind:value={album.dateString} />
        </FormLabel>

        <FormLabel name="Buy link (optional)">
            <input type="url" bind:value={album.buyUrl} />
        </FormLabel>
    </Collapsible>

    <Collapsible summaryText="Description" bind:this={descriptionDetails}>
        <MultilingualEditor bind:defaultText={album.description} bind:lingualTexts={album.lingualDescriptions} />
    </Collapsible>

    <Collapsible summaryText="Image" bind:this={imageDetails}>
        <ImagePicker
            bind:fullresUrl={album.imgUrl}
            bind:thumbnailUrl={album.thumbnailUrl}
            folderPath="albums"
            allowPickFromFolders={[
                {
                    displayName: "Gallery",
                    path: "gallery"
                },
            ]}
        />
    </Collapsible>

    <Collapsible summaryText="Recordings" bind:this={recordingsDetails}>
        <RecordingsEditor bind:recordings={album.recordings} />
    </Collapsible>
</div>