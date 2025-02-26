<script lang="ts">

    import { getContext, onMount, tick } from "svelte";
    import type { DocumentReference } from "firebase/firestore";
    import { slide } from "svelte/transition";
    import LoadingSpinner from "../../../../ArtistKit/core/components/LoadingSpinner.svelte";
    import type { FirebaseManager } from "../../../../ArtistKit/core/libs/firebaseManager.svelte";
    import AlbumEditor from "../../../../ArtistKit/modules/discography/admin/components/AlbumEditor.svelte";

    let firebaseManager = getContext<() => FirebaseManager | undefined>("firebaseManager")();
    
    let albumRefs: DocumentReference[] = $state([]);

    let singleEditors: AlbumEditor[] = $state([]);

    let saving: boolean = $state(false);

    onMount(async () => {
        if (!firebaseManager) return;

        albumRefs = (await firebaseManager.getAlbums()).docs.map((d) => d.ref);
    });

    async function addAlbum() {
        if (!firebaseManager) return;

        const docRef = await firebaseManager.addAlbum({
            title: "",
            subtitle: "",
            date: new Date(),
            description: "",
            lingualDescriptions: {},
            imgUrl: "",
            thumbnailUrl: "",
            buyUrl: "",
            recordings: []
        });

        albumRefs = [...albumRefs, docRef];

        await tick();

        window.scroll({
            behavior: "smooth",
            top: document.documentElement.scrollHeight
        });
    }

    async function save() {
        saving = true;

        const promises = [];

        for (const editor of singleEditors) {
            promises.push(editor.save());
        }

        await Promise.all(promises);

        saving = false;
    }

    function onDelete(id: string) {
        albumRefs = albumRefs.filter((ref) => ref.id !== id);
    }

</script>

<div>
    <h2>Edit Discography</h2>

    <div class="editor-wrapper">
        <div class="toolbar">
            <button class="toolbar-button" onclick={addAlbum}>Add album</button>
            <button class="toolbar-button" onclick={save}>Save</button>
        </div>
    
        {#if saving}
            <div class="saving-backdrop">
                <LoadingSpinner message="Saving albums..." />
            </div>
        {:else}
            {#each albumRefs as album, i}
                <div transition:slide={{ duration: 250 }}>
                    <AlbumEditor albumRef={album} bind:this={singleEditors[i]} ondeleted={onDelete} />
                </div>
            {/each}
        {/if}
    </div>
</div>