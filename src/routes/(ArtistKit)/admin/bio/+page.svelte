<script lang="ts">

    import { getContext, onMount } from "svelte";
    import type { DocumentReference } from "firebase/firestore";
    import type { FirebaseManager } from "../../../../ArtistKit/core/libs/firebaseManager.svelte";
    import LoadingSpinner from "../../../../ArtistKit/core/components/LoadingSpinner.svelte";
    import BioEditor from "../../../../ArtistKit/modules/bio/admin/components/BioEditor.svelte";
    
    let firebaseManager = getContext<() => FirebaseManager | undefined>("firebaseManager")();

    let biosRefs: DocumentReference[] = $state([]);

    let saving: boolean = $state(false);

    onMount(async () => {
        if (!firebaseManager) return;

        biosRefs = (await firebaseManager.getBios()).docs.map((d) => d.ref);
    });

    let singleEditors: BioEditor[] = $state([]);

    async function save() {
        saving = true;

        const promises = [];

        for (const editor of singleEditors) {
            promises.push(editor.save());
        }

        await Promise.all(promises);

        saving = false;
    }

</script>

<div>
    <h2>Edit Biographies</h2>

    <div class="editor-wrapper">
        <div class="toolbar">
            <button class="toolbar-button" onclick={save}>Save</button>
        </div>
    
        {#if saving}
            <div class="saving-backdrop">
                <LoadingSpinner message="Saving gallery..." />
            </div>
        {:else}
            {#each biosRefs as bio, i}
                <BioEditor bioRef={bio} bind:this={singleEditors[i]} />
            {/each}
        {/if}
    </div>
</div>