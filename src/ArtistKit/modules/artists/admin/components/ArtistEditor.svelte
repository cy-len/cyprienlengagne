<script lang="ts">
    import { type DocumentReference, updateDoc, getDoc, deleteDoc } from "firebase/firestore";
    import { onMount } from "svelte";
    import Collapsible from "../../../../core/components/Collapsible.svelte";
    import FormLabel from "../../../../core/components/forms/FormLabel.svelte";
    import MultilingualEditor from "../../../../core/components/admin/MultilingualEditor.svelte";
    import ImagePicker from "../../../../core/components/admin/images/ImagePicker.svelte";
    
    interface Props {
        artistRef: DocumentReference;
        ondeleted: (id: string) => any;
    }

    interface FirebaseArtist {
        name: string;
        role: string;
        imgUrl: string;
        imgXOffset: number;
        imgYOffset: number;
        thumbnailUrl: string;
        thumbnailXOffset: number;
        thumbnailYOffset: number;
        bio: string;
        lingualBio: { [key: string]: string };
        websiteUrl?: string;
        tags: { [key: string]: string };
    }

    interface EditorArtist {
        name: string;
        role: string;
        imgUrl: string;
        imgXOffset: number;
        imgYOffset: number;
        thumbnailUrl: string;
        thumbnailXOffset: number;
        thumbnailYOffset: number;
        bio: string;
        lingualBio: { [key: string]: string };
        websiteUrl?: string;
        tags: { [key: string]: string };
    }

    let { artistRef, ondeleted }: Props = $props();

    let artist = $state<EditorArtist>({
        name: "",
        role: "",
        imgUrl: "",
        imgXOffset: 50,
        imgYOffset: 50,
        thumbnailUrl: "",
        thumbnailXOffset: 50,
        thumbnailYOffset: 50,
        bio: "",
        lingualBio: {},
        websiteUrl: "",
        tags: {},
    });

    let hash: string = $state("");

    let basicDetails: Collapsible;
    let bioDetails: Collapsible;
    let imageDetails: Collapsible;

    onMount(async () => {
        const snapshot = await getDoc(artistRef);
        const data = snapshot.data();
        if (!data) return;

        artist.name = data.name;
        artist.role = data.role;
        artist.imgUrl = data.imgUrl;
        artist.imgXOffset = data.imgXOffset;
        artist.imgYOffset = data.imgYOffset;
        artist.thumbnailUrl = data.thumbnailUrl;
        artist.thumbnailXOffset = data.thumbnailXOffset;
        artist.thumbnailYOffset = data.thumbnailYOffset;
        artist.bio = data.bio;
        artist.lingualBio = data.lingualBio;
        artist.websiteUrl = data.websiteUrl;
        artist.tags = data.tags;

        hash = JSON.stringify(artist);
    });

    export async function save() {
        if (!modified) return;

        const data: FirebaseArtist = {
            name: artist.name,
            role: artist.role,
            imgUrl: artist.imgUrl,
            imgXOffset: artist.imgXOffset,
            imgYOffset: artist.imgYOffset,
            thumbnailUrl: artist.thumbnailUrl,
            thumbnailXOffset: artist.thumbnailXOffset,
            thumbnailYOffset: artist.thumbnailYOffset,
            bio: artist.bio,
            lingualBio: artist.lingualBio,
            websiteUrl: artist.websiteUrl,
            tags: artist.tags,
        };

        await updateDoc(artistRef, data as any);

        hash = JSON.stringify(artist);
    }

    async function deleteConcert() {
        const areYouSure = prompt(`If you really want to delete the artist ${artist.name}, type YES and select ok`);
        if (areYouSure !== "YES") return;

        await deleteDoc(artistRef);
        ondeleted(artistRef.id);
    }

    function expandAll() {
        basicDetails.expand();
        bioDetails.expand();
        imageDetails.expand();
    }

    function collapseAll() {
        basicDetails.collapse();
        bioDetails.collapse();
        imageDetails.collapse();
    }

    let modified = $derived(hash !== JSON.stringify(artist));
</script>

<div class="editor-container" class:modified={modified}>
    <header>
        <h3>{artist.name || "New artist"}</h3>
        {#if modified}
            <div class="info">Has unsaved changes</div>
        {/if}

        <div class="bar">
            <button class="toolbar-button" onclick={expandAll}>Expand</button>
            <button class="toolbar-button" onclick={collapseAll}>Collapse</button>
            {#if modified}
                <button class="toolbar-button" onclick={save}>Save modifications</button>
            {/if}
            <button class="toolbar-button red" onclick={deleteConcert}>Delete artist</button>
        </div>
    </header>

    <Collapsible summaryText="Basic details" bind:this={basicDetails}>
        <FormLabel name="Name">
            <input type="text" bind:value={artist.name} />
        </FormLabel>
        <FormLabel name="Role/Instrument (eg. Piano, Composer)">
            <input type="text" bind:value={artist.role} />
        </FormLabel>
        <FormLabel name="Website Url (optional)">
            <input type="url" bind:value={artist.websiteUrl} />
        </FormLabel>
    </Collapsible>

    <Collapsible summaryText="Biography" bind:this={bioDetails}>
        <MultilingualEditor bind:defaultText={artist.bio} bind:lingualTexts={artist.lingualBio} />
    </Collapsible>

    <Collapsible summaryText="Image" bind:this={imageDetails}>
        <ImagePicker
            bind:fullresUrl={artist.imgUrl}
            bind:thumbnailUrl={artist.thumbnailUrl}
            folderPath="artists"
            allowPickFromFolders={[
                {
                    displayName: "Gallery",
                    path: "gallery"
                },
                {
                    displayName: "Artists",
                    path: "artists"
                }
            ]}
        />
    </Collapsible>
</div>