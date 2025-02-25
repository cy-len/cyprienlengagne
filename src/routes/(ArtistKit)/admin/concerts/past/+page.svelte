<script lang="ts">
    import { getContext, onMount } from "svelte";
    import type { DocumentReference } from "firebase/firestore";
    import { slide } from "svelte/transition";
    import LoadingSpinner from "../../../../../ArtistKit/core/components/LoadingSpinner.svelte";
    import type { FirebaseManager } from "../../../../../ArtistKit/core/libs/firebaseManager.svelte";
    import ConcertEditor from "../../../../../ArtistKit/modules/concerts/admin/components/ConcertEditor.svelte";

    let firebaseManager = getContext<() => FirebaseManager | undefined>("firebaseManager")();

    let concertsRefs: DocumentReference[] = $state([]);

    let saving: boolean = $state(false);

    onMount(async () => {
        if (!firebaseManager) return;

        concertsRefs = (await firebaseManager.getPastConcerts()).docs.map((d) => d.ref);
    });

    let singleEditors: ConcertEditor[] = $state([]);

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
        concertsRefs = concertsRefs.filter((ref) => ref.id !== id);
    }

</script>

<div>
    <h3>Past concerts ({ concertsRefs.length })</h3>

    <div class="editor-wrapper">
        <div class="toolbar">
            <button class="toolbar-button" onclick={save}>Save all</button>
        </div>

        {#if saving}
            <div class="saving-backdrop">
                <LoadingSpinner message="Saving past concerts..." />
            </div>
        {:else}
            {#each concertsRefs as concert, i}
                <div transition:slide={{ duration: 250 }}>
                    <ConcertEditor concertRef={concert} bind:this={singleEditors[i]} ondeleted={onDelete} />
                </div>
            {/each}
        {/if}
    </div>
</div>