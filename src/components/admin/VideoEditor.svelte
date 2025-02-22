<script lang="ts">

    import { type DocumentReference, updateDoc, getDoc, deleteDoc } from "firebase/firestore";
    import { onMount } from "svelte";
    import { extractYouTubeHandle } from "../../utils/stringUtils";
    import Collapsible from "./utils/Collapsible.svelte";
    import YoutubeFetcher from "./fetchers/YoutubeFetcher.svelte";
    import FormLabel from "../utils/forms/FormLabel.svelte";

    interface Props {
        videoRef: DocumentReference;
        ondeleted: (id: string) => any;
    }

    let { videoRef, ondeleted }: Props = $props();

    interface EditorVideo {
        youtubeHandle: string;
        title: string;
        date: Date;
    }

    let video = $state<EditorVideo>({
        youtubeHandle: "",
        title: "",
        date: new Date()
    });

    let hash: string = $state("");

    let basicDetails: Collapsible;
    let youtubeDetails: Collapsible;

    onMount(async () => {
        const snapshot = await getDoc(videoRef);
        const data = snapshot.data();
        if (!data) return;

        video.youtubeHandle = data.youtubeHandle;
        video.title = data.title;
        video.date = data.addedDate.toDate();

        hash = JSON.stringify(video);
    });

    export async function save() {
        if (!modified) return;

        video.youtubeHandle = extractYouTubeHandle(video.youtubeHandle);

        await updateDoc(videoRef, {
            youtubeHandle: video.youtubeHandle,
            title: video.title,
            date: video.date
        });
        hash = JSON.stringify(video);
    }

    async function deleteVideo() {
        const areYouSure = prompt(`If you really want to delete the video ${video.title}, type YES and select ok`);
        if (areYouSure !== "YES") return;

        await deleteDoc(videoRef);
        ondeleted(videoRef.id);
    }

    function expandAll() {
        basicDetails.expand();
        youtubeDetails.expand();
    }

    function collapseAll() {
        basicDetails.collapse();
        youtubeDetails.collapse();
    }

    let modified = $derived(hash !== JSON.stringify(video));
</script>

<div class="editor-container" class:modified={modified}>
    <header>
        <h3>{ video.title ?? "New video" } (uploaded on { (new Date(video.date)).toLocaleDateString() })</h3>
        {#if modified}
            <div class="info">Has unsaved changes</div>
        {/if}

        <div class="bar">
            <button class="toolbar-button" onclick={expandAll}>Expand</button>
            <button class="toolbar-button" onclick={collapseAll}>Collapse</button>
            {#if modified}
                <button class="toolbar-button" onclick={save}>Save modifications</button>
            {/if}
            <button class="toolbar-button red" onclick={deleteVideo}>Delete video</button>
        </div>
    </header>

    <Collapsible summaryText="Basic infos" bind:this={basicDetails}>
        <FormLabel name="Title">
            <input type="text" bind:value={video.title} />
        </FormLabel>
    </Collapsible>

    <Collapsible summaryText="YouTube video" bind:this={youtubeDetails}>
        <YoutubeFetcher bind:handle={video.youtubeHandle} />
    </Collapsible>
</div>