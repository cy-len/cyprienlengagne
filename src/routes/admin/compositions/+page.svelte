<script lang="ts">

    import { getContext, onMount, tick } from "svelte";
    import type { DocumentReference } from "firebase/firestore";
    import LoadingSpinner from "../../../components/utils/LoadingSpinner.svelte";
    import CompositionEditor from "../../../components/admin/CompositionEditor.svelte";
    import type { FirebaseManager } from "../../../firebase/firebaseManager.svelte";
    import { slide } from "svelte/transition";

    let firebaseManager = getContext<() => FirebaseManager | undefined>("firebaseManager")();
    
    let compositionRefs: DocumentReference[] = $state([]);

    let singleEditors: CompositionEditor[] = $state([]);

    let saving: boolean = $state(false);

    onMount(async () => {
        if (!firebaseManager) return;

        compositionRefs = (await firebaseManager.getCompositions()).docs.map((d) => d.ref);
    });

    async function addComposition() {
        if (!firebaseManager) return;

        const docRef = await firebaseManager.addComposition({
            name: "",
            category: "Orchestra",
            compositionDate: new Date(),
            duration: "00:00:00",
            instrumentation: "",
            description: "",
            lingualDescriptions: {},
            premiered: false,
            premiereDate: new Date(),
            premiereLocation: "",
            premierePerformers: "",
            recordingVideo: ""
        });

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

    function onDelete(id: string) {
        compositionRefs = compositionRefs.filter((ref) => ref.id !== id);
    }

</script>

<div>
    <h2>Edit Compositions</h2>

    <div class="editor-wrapper">
        <div class="toolbar">
            <button class="toolbar-button" onclick={addComposition}>Add composition</button>
            <button class="toolbar-button" onclick={save}>Save</button>
        </div>
    
        {#if saving}
            <div class="saving-backdrop">
                <LoadingSpinner message="Saving compositions..." />
            </div>
        {:else}
            {#each compositionRefs as composition, i}
                <div transition:slide={{ duration: 250 }}>
                    <CompositionEditor compositionRef={composition} bind:this={singleEditors[i]} ondeleted={onDelete} />
                </div>
            {/each}
        {/if}
    </div>
</div>