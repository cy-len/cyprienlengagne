<script lang="ts">

    import { getContext, onMount, tick } from "svelte";
    import type { DocumentReference } from "firebase/firestore";
    import { slide } from "svelte/transition";
    import LoadingSpinner from "../../../../ArtistKit/core/components/LoadingSpinner.svelte";
    import type { FirebaseManager } from "../../../../ArtistKit/core/libs/firebaseManager.svelte";
    import VideoEditor from "../../../../ArtistKit/modules/videos/admin/components/VideoEditor.svelte";
    
    let firebaseManager = getContext<() => FirebaseManager | undefined>("firebaseManager")();

    let videosRefs: DocumentReference[] = $state([]);

    let singleEditors: VideoEditor[] = $state([]);

    let saving: boolean = $state(false);

    onMount(async () => {
        if (!firebaseManager) return;
        videosRefs = (await firebaseManager.getVideos()).docs.map((d) => d.ref);
    });

    async function addVideo() {
        if (!firebaseManager) return;

        const docRef = await firebaseManager.addVideo({
            youtubeHandle: "dQw4w9WgXcQ",
            title: "",
            addedDate: new Date()
        });

        videosRefs = [...videosRefs, docRef];

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
        videosRefs = videosRefs.filter((ref) => ref.id !== id);
    }

</script>

<div>
    <h2>Edit Videos</h2>

    <div class="editor-wrapper">
        <div class="toolbar">
            <button class="toolbar-button" onclick={addVideo}>Add video</button>
            <button class="toolbar-button" onclick={save}>Save</button>
        </div>
    
        
        {#if saving}
            <div class="saving-backdrop">
                <LoadingSpinner message="Saving videos..." />
            </div>
        {:else}
            {#each videosRefs as picture, i}
                <div transition:slide={{ duration: 250 }}>
                    <VideoEditor videoRef={picture} bind:this={singleEditors[i]} ondeleted={onDelete} />
                </div>
            {/each}
        {/if}
    </div>
</div>