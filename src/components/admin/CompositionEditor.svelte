<script lang="ts">

    import { type DocumentReference, updateDoc, getDoc, deleteDoc } from "firebase/firestore";
    import { onMount, createEventDispatcher } from "svelte";
    import { extractYouTubeHandle } from "../../utils/stringUtils";
    import { categoryByLanguage } from "../../utils/compositionUtils";

    const dispatch = createEventDispatcher();

    export let compositionRef: DocumentReference;

    let name: string = "";
    let description: string = "";
    let category: string = "";
    let premiereDateString: string = "";
    let premiereLocation: string = "";
    let premierePerformers: string = "";
    let recordingVideo: string = "";

    let hash: string = "";

    function computeHash() {
        return name + description + category + premiereDateString + premiereLocation + premierePerformers + recordingVideo;
    }

    onMount(async () => {
        const snapshot = await getDoc(compositionRef);
        const data = snapshot.data();
        if (!data) return;

        name = data.name;
        description = data.description;
        category = data.category;
        premiereDateString = data.premiereDate.toDate().toISOString().split("T")[0];
        premiereLocation = data.premiereLocation;
        premierePerformers = data.premierePerformers;
        recordingVideo = data.recordingVideo;

        hash = computeHash();
    });

    export async function save() {
        if (!modified) return;

        recordingVideo = extractYouTubeHandle(recordingVideo);

        const data = {
            name,
            description,
            category,
            premiereDate: new Date(premiereDateString),
            premiereLocation,
            premierePerformers,
            recordingVideo
        };
        await updateDoc(compositionRef, data);
        hash = computeHash();
    }

    async function deleteComposition() {
        const areYouSure = prompt(`If you really want to delete ${name}, type YES and select ok`);
        if (areYouSure !== "YES") return;

        await deleteDoc(compositionRef);
        dispatch("deleted", {
            ref: compositionRef
        });
    }

    const idBase = "" + Math.ceil(Math.random() * 10000);

    $: modified = hash !== name + description + category + premiereDateString + premiereLocation + premierePerformers + recordingVideo;
</script>

<div class="editor-container" class:modified={modified}>
    <div class="editor-grid">
        <label for="{idBase}-name" class="name-label">Name</label>
        <input type="text" id="{idBase}-name" class="name-field" bind:value={name} />
        <label for="{idBase}-category" class="category-label">Category</label>
        <select name="category-field" id="{idBase}-category" class="category-field" bind:value={category}>
            {#each Object.keys(categoryByLanguage["en"]) as category}
                <option value={category}>{categoryByLanguage["en"][category]}</option>
            {/each}
        </select>
        
        <label for="{idBase}-premiere-date" class="premiere-date-label">Premiere date</label>
        <input type="date" id="{idBase}-premiere-date" class="premiere-date-field" bind:value={premiereDateString} />
        <label for="{idBase}-premiere-location" class="premiere-location-label">Premiere location</label>
        <input type="text" id="{idBase}-premiere-location" class="premiere-location-field" bind:value={premiereLocation} />
        <label for="{idBase}-premiere-performers" class="premiere-performers-label">Premiere performers</label>
        <input type="text" id="{idBase}-premiere-performers" class="premiere-performers-field" bind:value={premierePerformers} />
        
        <label for="{idBase}-description" class="description-label">Description</label>
        <textarea id="{idBase}-description" class="description-field" cols="4" bind:value={description} />
    
        <label for="{idBase}-recording-video" class="recording-video-label">Youtube Video link/handle (will automatically be replaced by video ID on save)</label>
        <input type="text" id="{idBase}-recording-video" class="recording-video-field" bind:value={recordingVideo} />
    
        <div class="delete-button">
            <button class="toolbar-button" on:click={deleteComposition}>Delete composition</button>
        </div>
    </div>
</div>

<style>

.editor-grid {
        grid-template-areas:
            "name-label name-label category-label delete-button"
            "name-field name-field category-field delete-button"
            "premiere-date-label premiere-location-label premiere-performers-label delete-button"
            "premiere-date-field premiere-location-field premiere-performers-field delete-button"
            "description-label . . delete-button"
            "description-field description-field description-field delete-button"
            "recording-video-label recording-video-label recording-video-label delete-button"
            "recording-video-field recording-video-field recording-video-field delete-button";
        
        grid-template-columns: 1fr 1fr 1fr 10rem;
        grid-template-rows: min-content min-content min-content min-content min-content 8rem min-content min-content min-content;
    }

    input, textarea {
        display: block;
        font: inherit;
    }

    .name-label {
        grid-area: name-label;
    }

    .name-field {
        grid-area: name-field;
    }

    .category-label {
        grid-area: category-label;
    }

    .category-field {
        grid-area: category-field;
    }

    .premiere-date-label {
        grid-area: premiere-date-label;
    }

    .premiere-date-field {
        grid-area: premiere-date-field;
    }

    .premiere-location-label {
        grid-area: premiere-location-label;
    }

    .premiere-location-field {
        grid-area: premiere-location-field;
    }

    .premiere-performers-label {
        grid-area: premiere-performers-label;
    }

    .premiere-performers-field {
        grid-area: premiere-performers-field;
    }

    .description-label {
        grid-area: description-label;
    }

    .description-field {
        grid-area: description-field;
    }

    .recording-video-label {
        grid-area: recording-video-label;
    }

    .recording-video-field {
        grid-area: recording-video-field;
    }
</style>