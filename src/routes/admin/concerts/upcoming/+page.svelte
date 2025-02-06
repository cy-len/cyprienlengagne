<script lang="ts">
    import { getContext, onMount, tick } from "svelte";
    import type { DocumentReference } from "firebase/firestore";
    import LoadingSpinner from "../../../../components/utils/LoadingSpinner.svelte";
    import ConcertEditor from "../../../../components/admin/ConcertEditor.svelte";
    import type { FirebaseManager } from "../../../../firebase/firebaseManager.svelte";
    import { slide } from "svelte/transition";
    import ShareConcertTextModal from "../../../../components/admin/ShareConcertTextModal.svelte";

    let firebaseManager = getContext<() => FirebaseManager | undefined>("firebaseManager")();

    let concertsRefs: DocumentReference[] = $state([]);

    let saving: boolean = $state(false);
    let shareModal: ShareConcertTextModal;

    onMount(async () => {
        if (!firebaseManager) return;
        concertsRefs = (await firebaseManager.getUpcomingConcerts()).docs.map((d) => d.ref);
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

    async function addConcert() {
        if (!firebaseManager) return;

        const docRef = await firebaseManager.addConcert({
            location: "",
            locationPrecise: "",
            timeEnabled: false,
            description: "",
            lingualDescriptions: {},
            date: new Date(),
            url: ""
        });

        concertsRefs = [...concertsRefs, docRef];

        await tick();

        window.scroll({
            behavior: "smooth",
            top: document.documentElement.scrollHeight
        });
    }

    function share() {
        shareModal.show(singleEditors.map(editor => editor.toJSON()));
    }

    function onDelete(id: string) {
        concertsRefs = concertsRefs.filter((ref) => ref.id !== id);
    }

</script>

<div>
    <h3>Upcoming concerts ({ concertsRefs.length })</h3>

    <div class="editor-wrapper">
        <div class="toolbar">
            <button class="toolbar-button" onclick={addConcert}>Add concert</button>
            <button class="toolbar-button" onclick={save}>Save all</button>
            <button class="toolbar-button" onclick={share}>Share all</button>
        </div>

        {#if saving}
            <div class="saving-backdrop">
                <LoadingSpinner message="Saving upcoming concerts..." />
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
<ShareConcertTextModal bind:this={shareModal} />