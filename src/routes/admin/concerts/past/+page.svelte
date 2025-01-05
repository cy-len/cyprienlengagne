<script lang="ts">
    import { onMount } from "svelte";
    import { type CollectionReference, type DocumentReference } from "firebase/firestore";
    import LoadingSpinner from "../../../../components/utils/LoadingSpinner.svelte";
    import ConcertEditor from "../../../../components/admin/ConcertEditor.svelte";

    let concertsRefs: DocumentReference[] = [];

    let concertsCol: CollectionReference | null = null;

    let saving: boolean = false;

    onMount(async () => {
        const { getPastConcerts, concertsCollection }  = await import("../../../../firebase");
        concertsCol = concertsCollection;
        concertsRefs = (await getPastConcerts()).docs.map((d) => d.ref);
    });

    let singleEditors: ConcertEditor[] = [];

    async function save() {
        saving = true;

        const promises = [];

        for (const editor of singleEditors) {
            promises.push(editor.save());
        }

        await Promise.all(promises);

        saving = false;
    }

    function onDelete(event: any) {
        concertsRefs = concertsRefs.filter((ref) => ref !== event.detail.ref);
    }

</script>

<div>
    <h3>Past concerts ({ concertsRefs.length })</h3>

    <div class="editor-wrapper">
        <div class="toolbar">
            <button class="toolbar-button" on:click={save}>Save</button>
        </div>

        {#if saving}
            <div class="saving-backdrop">
                <LoadingSpinner message="Saving past concerts..." />
            </div>
        {:else}
            {#each concertsRefs as concert, i}
                <ConcertEditor concertRef={concert} bind:this={singleEditors[i]} on:deleted={onDelete} />
            {/each}
        {/if}
    </div>
</div>