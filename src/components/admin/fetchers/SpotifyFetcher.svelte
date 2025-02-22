<script lang="ts">
    import { extractSpotifyHandle } from "../../../utils/stringUtils";
    import FormLabel from "../../utils/forms/FormLabel.svelte";

    interface Props {
        handle: string;
    }

    let { handle = $bindable() }: Props = $props();

    function replaceLinkByHandle() {
        handle = extractSpotifyHandle(handle);
    }

</script>

<div class="youtube-fetcher">
    <FormLabel name="Spotify track link/ID (will automatically be replaced by track ID)" icon="spotify.svg" iconAlt="Spotify fetcher">
        <input type="text" bind:value={handle} onblur={replaceLinkByHandle} />
        <div class="info">The Spotify handle is the string of random characters that identifies the track, album, or playlist, and can be found in the Spotify page URL</div>
    </FormLabel>

    {#if handle && !handle.includes("spotify.com")}
        <iframe class="yt-video youtube-preview" width="100%" height="352" src="https://open.spotify.com/embed/{handle}?utm_source=generator" title="Spotify player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" loading="lazy" allowfullscreen></iframe>
    {/if}
</div>

<style>

    .youtube-preview {
        margin-top: 1rem;
    }

</style>