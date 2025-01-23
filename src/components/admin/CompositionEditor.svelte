<script lang="ts">
    import { type DocumentReference, updateDoc, getDoc, deleteDoc } from "firebase/firestore";
    import { onMount } from "svelte";
    import { extractYouTubeHandle } from "../../utils/stringUtils";
    import { categoryByLanguage } from "../../utils/compositionUtils";
    import MultilingualEditor from "./MultilingualEditor.svelte";
    import Collapsible from "./Collapsible.svelte";
    import YoutubeFetcher from "./YoutubeFetcher.svelte";

    interface Props {
        compositionRef: DocumentReference;
        ondeleted: (id: string) => any;
    }

    let { compositionRef, ondeleted }: Props = $props();

    interface FirebaseComposition {
        name: string;
        category: string;
        duration: string;
        compositionDateString: string;
        instrumentation: string;
        premiered: boolean;
        premiereDateString: string;
        premiereLocation: string;
        premierePerformers: string;
        description: string;
        lingualDescriptions: { [key: string]: string };
        recordingVideo: string;
    }

    let composition = $state<FirebaseComposition>({
        name: "",
        category: "",
        duration: "",
        compositionDateString: "",
        instrumentation: "",
        premiered: false,
        premiereDateString: "",
        premiereLocation: "",
        premierePerformers: "",
        description: "",
        lingualDescriptions: {},
        recordingVideo: ""
    });

    let hash: string = $state("");

    let basicDetails: Collapsible;
    let premiereDetails: Collapsible;
    let recordingsDetails: Collapsible;
    let descriptionDetails: Collapsible;

    onMount(async () => {
        const snapshot = await getDoc(compositionRef);
        const data = snapshot.data();
        if (!data) return;

        composition.name = data.name;
        composition.category = data.category;
        composition.duration = data.duration ?? "";
        composition.instrumentation = data.instrumentation ?? "";
        composition.compositionDateString = data.compositionDate.toDate().toISOString().split("T")[0];
        composition.description = data.description ?? "";
        composition.lingualDescriptions = data.lingualDescriptions ?? {};
        composition.premiered = data.premiered ?? false;
        composition.premiereDateString = data.premiereDate.toDate().toISOString().split("T")[0];
        composition.premiereLocation = data.premiereLocation ?? "";
        composition.premierePerformers = data.premierePerformers ?? "";
        composition.recordingVideo = data.recordingVideo ?? "";

        hash = JSON.stringify(composition);
    });

    export async function save() {
        if (!modified) return;

        composition.recordingVideo = extractYouTubeHandle(composition.recordingVideo);

        await updateDoc(compositionRef, {
            name: composition.name,
            category: composition.category,
            duration: composition.duration,
            instrumentation: composition.instrumentation,
            compositionDate: new Date(composition.compositionDateString),
            premiered: composition.premiered,
            premiereDate: new Date(composition.premiereDateString),
            premiereLocation: composition.premiereLocation,
            premierePerformers: composition.premierePerformers,
            description: composition.description,
            lingualDescriptions: composition.lingualDescriptions,
            recordingVideo: composition.recordingVideo
        });
        hash = JSON.stringify(composition);
    }

    async function deleteComposition() {
        const areYouSure = prompt(`If you really want to delete ${name}, type YES and select ok`);
        if (areYouSure !== "YES") return;

        await deleteDoc(compositionRef);
        ondeleted(compositionRef.id);
    }

    function expandAll() {
        basicDetails.expand();
        premiereDetails.expand();
        recordingsDetails.expand();
        descriptionDetails.expand();
    }

    function collapseAll() {
        basicDetails.collapse();
        premiereDetails.collapse();
        recordingsDetails.collapse();
        descriptionDetails.collapse();
    }

    const idBase = "" + Math.ceil(Math.random() * 10000);

    let modified = $derived(hash !== JSON.stringify(composition));
</script>

<div class="editor-container" class:modified={modified}>
    <header>
        <h3>{composition.name || "New composition"} ({ (new Date(composition.compositionDateString)).getFullYear() })</h3>
        {#if modified}
            <div class="info">Has unsaved changes</div>
        {/if}

        <div class="bar">
            <button class="toolbar-button" onclick={expandAll}>Expand</button>
            <button class="toolbar-button" onclick={collapseAll}>Collapse</button>
            {#if modified}
                <button class="toolbar-button" onclick={save}>Save modifications</button>
            {/if}
            <button class="toolbar-button red" onclick={deleteComposition}>Delete composition</button>
        </div>
    </header>

    <Collapsible summaryText="Basic details" bind:this={basicDetails}>
        <label for="{idBase}-name" class="name-label">Name</label>
        <input type="text" id="{idBase}-name" class="name-field" bind:value={composition.name} />

        <label for="{idBase}-composition-date" class="composition-date-label">Date of composition</label>
        <input type="date" id="{idBase}-composition-date" class="composition-date-field" bind:value={composition.compositionDateString} />
        
        <label for="{idBase}-category" class="category-label">Category</label>
        <select name="category-field" id="{idBase}-category" class="category-field" bind:value={composition.category}>
            {#each Object.keys(categoryByLanguage["en"]) as category}
                <option value={category}>{categoryByLanguage["en"][category]}</option>
            {/each}
        </select>

        <label for="{idBase}-instrumentation" class="instrumentation-label">Instrumentation</label>
        <input type="text" id="{idBase}-instrumentation" class="instrumentation-field" bind:value={composition.instrumentation} />

        <label for="{idBase}-duration" class="duration-label">Duration</label>
        <input type="time" id="{idBase}-duration" class="duration-field" step="1" bind:value={composition.duration} />
    </Collapsible>

    <Collapsible summaryText="Premiere" bind:this={premiereDetails}>
        <div class="checkbox-group">
            <input type="checkbox" id="{idBase}-premiered" name="{idBase}-premiered" bind:checked={composition.premiered} />
            <label for="{idBase}-premiered">Has been premiered or has a planned premiere</label>
        </div>

        {#if composition.premiered}
            <label for="{idBase}-premiere-date" class="premiere-date-label">Premiere date (required)</label>
            <input type="date" id="{idBase}-premiere-date" class="premiere-date-field" bind:value={composition.premiereDateString} />

            <label for="{idBase}-premiere-location" class="premiere-location-label">Premiere location (optional)</label>
            <input type="text" id="{idBase}-premiere-location" class="premiere-location-field" bind:value={composition.premiereLocation} />

            <label for="{idBase}-premiere-performers" class="premiere-performers-label">Premiere performers (optional)</label>
            <input type="text" id="{idBase}-premiere-performers" class="premiere-performers-field" bind:value={composition.premierePerformers} />
        {/if}
    </Collapsible>

    <Collapsible summaryText="Recordings" bind:this={recordingsDetails}>
        <YoutubeFetcher bind:handle={composition.recordingVideo} />
    </Collapsible>

    <Collapsible summaryText="Description" bind:this={descriptionDetails}>
        <MultilingualEditor bind:defaultText={composition.description} bind:lingualTexts={composition.lingualDescriptions} />
    </Collapsible>
</div>

<style>

    input, select {
        display: block;
        margin-bottom: 0.5rem;
    }

</style>