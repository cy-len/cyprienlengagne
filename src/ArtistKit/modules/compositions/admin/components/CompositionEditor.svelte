<script lang="ts">
    import { type DocumentReference, updateDoc, getDoc, deleteDoc } from "firebase/firestore";
    import { onMount } from "svelte";
    import type { Recording } from "../../../../core/types/recording";
    import { extractYouTubeHandle } from "../../../../core/utils/stringUtils";
    import { categoryByLanguage } from "../../compositionUtils";
    import FormLabel from "../../../../core/components/forms/FormLabel.svelte";
    import Collapsible from "../../../../core/components/Collapsible.svelte";
    import FormCheckbox from "../../../../core/components/forms/FormCheckbox.svelte";
    import RecordingsEditor from "../../../../core/components/admin/RecordingsEditor.svelte";
    import MultilingualEditor from "../../../../core/components/admin/MultilingualEditor.svelte";

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
        spotifyTrack: string;
        recordings: Recording[];
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
        recordingVideo: "",
        spotifyTrack: "",
        recordings: []
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
        composition.recordings = data.recordings ?? [];
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
            recordings: composition.recordings,
            recordingVideo: composition.recordingVideo,
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
        <FormLabel name="Name">
            <input type="text" bind:value={composition.name} />
        </FormLabel>
        <FormLabel name="Date of composition">
            <input type="date" bind:value={composition.compositionDateString} />
        </FormLabel>
        <FormLabel name="Category">
            <select name="category-field" bind:value={composition.category}>
                {#each Object.keys(categoryByLanguage["en"]) as category}
                    <option value={category}>{categoryByLanguage["en"][category]}</option>
                {/each}
            </select>
        </FormLabel>

        <FormLabel name="Instrumentation">
            <input type="text" bind:value={composition.instrumentation} />
        </FormLabel>

        <FormLabel name="Duration">
            <input type="time" step="1" bind:value={composition.duration} />
        </FormLabel>
    </Collapsible>

    <Collapsible summaryText="Premiere" bind:this={premiereDetails}>
        <FormCheckbox name="Has been premiered or has a planned premiere">
            <input type="checkbox" bind:checked={composition.premiered} />
        </FormCheckbox>

        {#if composition.premiered}
            <FormLabel name="Premiere date (required)">
                <input type="date" bind:value={composition.premiereDateString} />
            </FormLabel>
            <FormLabel name="Premiere location (optional)">
                <input type="text" bind:value={composition.premiereLocation} />
            </FormLabel>
            <FormLabel name="Premiere performers (optional)">
                <input type="text" bind:value={composition.premierePerformers} />
            </FormLabel>
        {/if}
    </Collapsible>

    <Collapsible summaryText="Recordings" bind:this={recordingsDetails}>
        <RecordingsEditor bind:recordings={composition.recordings} />
    </Collapsible>

    <Collapsible summaryText="Description" bind:this={descriptionDetails}>
        <MultilingualEditor bind:defaultText={composition.description} bind:lingualTexts={composition.lingualDescriptions} />
    </Collapsible>
</div>