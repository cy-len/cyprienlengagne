<script lang="ts">

    import { getContext, onMount, tick } from "svelte";
    import type { DocumentReference } from "firebase/firestore";
    import { slide } from "svelte/transition";
    import LoadingSpinner from "../../../../ArtistKit/core/components/LoadingSpinner.svelte";
    import type { FirebaseManager } from "../../../../ArtistKit/core/libs/firebaseManager.svelte";
    import NewsEditor from "../../../../ArtistKit/modules/news/admin/components/NewsEditor.svelte";

    let firebaseManager = getContext<() => FirebaseManager | undefined>("firebaseManager")();
    
    let newsRefs: DocumentReference[] = $state([]);

    let singleEditors: NewsEditor[] = $state([]);

    let saving: boolean = $state(false);

    onMount(async () => {
        if (!firebaseManager) return;
        newsRefs = (await firebaseManager.getNews()).docs.map((d) => d.ref);
    });

    async function addNews() {
        if (!firebaseManager) return;

        const docRef = await firebaseManager.addNews({
            image: {
                url: ""
            },
            thumbnail: {
                url: ""
            },
            imageCopyright: "",
            date: new Date(),
            text: {
                en: {
                    title: "",
                    content: ""
                },
                fr: {
                    title: "",
                    content: ""
                }
            }
        });

        newsRefs = [...newsRefs, docRef];

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
        newsRefs = newsRefs.filter((ref) => ref.id !== id);
    }

</script>

<div>
    <h2>Edit News</h2>

    <div class="editor-wrapper">
        <div class="toolbar">
            <button class="toolbar-button" onclick={addNews}>Add news</button>
            <button class="toolbar-button" onclick={save}>Save</button>
        </div>
    
        {#if saving}
            <div class="saving-backdrop">
                <LoadingSpinner message="Saving news..." />
            </div>
        {:else}
            {#each newsRefs as news, i}
                <div transition:slide={{ duration: 250 }}>
                    <NewsEditor newsRef={news} bind:this={singleEditors[i]} ondeleted={onDelete} />
                </div>
            {/each}
        {/if}
    </div>
</div>