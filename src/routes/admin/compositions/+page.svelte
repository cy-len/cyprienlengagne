<script lang="ts">

    import { onMount, tick } from "svelte";
    import { addDoc, type CollectionReference, type DocumentReference } from "firebase/firestore";
    import LoadingSpinner from "../../../components/utils/LoadingSpinner.svelte";
    import type { Composition } from "../../../types/composition";
    import CompositionEditor from "../../../components/admin/CompositionEditor.svelte";
    
    let compositionsCol: CollectionReference | null = null;

    let compositionRefs: DocumentReference[] = [];

    let singleEditors: CompositionEditor[] = [];

    let saving: boolean = false;

    onMount(async () => {
        const { compositionsCollection, getCompositions }  = await import("../../../firebase");
        compositionsCol = compositionsCollection;
        compositionRefs = (await getCompositions()).docs.map((d) => d.ref);
    });

    async function addComposition() {
        if (!compositionsCol) return;

        const docRef = await addDoc(compositionsCol, {
            name: "",
            description: "",
            category: "Orchestra",
            premiereDate: new Date(),
            premiereLocation: "",
            premierePerformers: "",
            recordingVideo: ""
        } as Composition);

        compositionRefs = [...compositionRefs, docRef];

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

    function onDelete(event: any) {
        compositionRefs = compositionRefs.filter((ref) => ref !== event.detail.ref);
    }

</script>

<div>
    <h2>Edit Compositions</h2>

    <div class="editor-wrapper">
        <div class="toolbar">
            <button class="toolbar-button" on:click={addComposition}>Add composition</button>
            <button class="toolbar-button" on:click={save}>Save</button>
        </div>
    
        {#if saving}
            <div class="saving-backdrop">
                <LoadingSpinner message="Saving composition..." />
            </div>
        {:else}
            {#each compositionRefs as composition, i}
                <CompositionEditor compositionRef={composition} bind:this={singleEditors[i]} on:deleted={onDelete} />
            {/each}
        {/if}
    </div>
</div>