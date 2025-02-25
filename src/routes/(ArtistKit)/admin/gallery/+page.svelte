<script lang="ts">

    import { getContext, onMount, tick } from "svelte";
    import type { DocumentReference } from "firebase/firestore";
    import { slide } from "svelte/transition";
    import LoadingSpinner from "../../../../ArtistKit/core/components/LoadingSpinner.svelte";
    import type { FirebaseManager } from "../../../../ArtistKit/core/libs/firebaseManager.svelte";
    import GalleryPictureEditor from "../../../../ArtistKit/modules/gallery/admin/components/GalleryPictureEditor.svelte";

    let firebaseManager = getContext<() => FirebaseManager | undefined>("firebaseManager")();
    
    let picturesRefs: DocumentReference[] = $state([]);

    let singleEditors: GalleryPictureEditor[] = $state([]);

    let saving: boolean = $state(false);

    onMount(async () => {
        if (!firebaseManager) return;

        picturesRefs = (await firebaseManager.getPictures()).docs.map((d) => d.ref);
    });

    async function addPicture() {
        if (!firebaseManager) return;

        const docRef = await firebaseManager.addGalleryPicture({
            url: "",
            thumbnailUrl: "",
            copyright: "Copyright",
            thumbnailOffset: {
                x: 0,
                y: 0
            },
            uploadedDate: new Date()
        });

        picturesRefs = [...picturesRefs, docRef];

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
        picturesRefs = picturesRefs.filter((ref) => ref.id !== id);
    }

</script>

<div>
    <h2>Edit Gallery</h2>

    <div class="editor-wrapper">
        <div class="toolbar">
            <button class="toolbar-button" onclick={addPicture}>Add picture</button>
            <button class="toolbar-button" onclick={save}>Save</button>
        </div>
    
        {#if saving}
            <div class="saving-backdrop">
                <LoadingSpinner message="Saving gallery..." />
            </div>
        {:else}
            {#each picturesRefs as picture, i}
                <div transition:slide={{ duration: 250 }}>
                    <GalleryPictureEditor pictureRef={picture} bind:this={singleEditors[i]} ondeleted={onDelete} />
                </div>
            {/each}
        {/if}
    </div>
</div>