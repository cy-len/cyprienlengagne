<script lang="ts">
    import { extractYouTubeHandle } from "../../../utils/stringUtils";
    import FormLabel from "../../utils/forms/FormLabel.svelte";

    interface Props {
        handle: string;
    }

    let { handle = $bindable() }: Props = $props();

    function replaceLinkByHandle() {
        handle = extractYouTubeHandle(handle);
    }

</script>

<div class="youtube-fetcher">
    <FormLabel name="Youtube Video link/handle (will automatically be replaced by video ID)" icon="youtube.svg" iconAlt="YouTube">
        <input type="text" bind:value={handle} onblur={replaceLinkByHandle} />
        <div class="info">The YouTube handle is the string of random characters that identifies the YouTube video, and can be found in the YouTube page URL after this part: youtube.com/watch?v=</div>
    </FormLabel>

    {#if handle && !handle.includes("youtube.com") && !handle.includes("youtu.be")}
        <iframe class="yt-video youtube-preview" width="560" height="315" src="https://www.youtube.com/embed/{handle}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    {/if}
</div>

<style>

    .youtube-preview {
        margin-top: 1rem;
    }

</style>