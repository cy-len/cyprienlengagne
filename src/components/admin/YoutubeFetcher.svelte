<script lang="ts">
    import { extractYouTubeHandle } from "../../utils/stringUtils";

    interface Props {
        handle: string;
    }

    let { handle = $bindable() }: Props = $props();

    function replaceLinkByHandle() {
        handle = extractYouTubeHandle(handle);
    }

    const idBase = "youtube-fetcher" + Math.ceil(Math.random() * 10000);

</script>

<div class="youtube-fetcher">
    <div class="youtube-handle">
        <label for="{idBase}-youtube-handle" class="youtube-handle-label">Youtube Video link/handle (will automatically be replaced by video ID)</label>
        <input type="text" id="{idBase}-youtube-handle" class="youtube-handle-field" bind:value={handle} onblur={replaceLinkByHandle} />
        <div class="info">The YouTube handle is the string of random characters that identifies the YouTube video, and can be found in the YouTube page URL after this part: youtube.com/watch?v=</div>
    </div>

    {#if !handle.includes("youtube.com") && !handle.includes("youtu.be")}
        <iframe class="yt-video youtube-preview" width="560" height="315" src="https://www.youtube.com/embed/{handle}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    {/if}
</div>

<style>

    .youtube-preview {
        margin-top: 1rem;
    }

</style>