<script lang="ts">
    import type { Recording } from "../types/recording";
    import { extractYouTubeHandle, extractSpotifyHandle } from "../utils/stringUtils";


    interface Props {
        recording: Recording;
        youtubePlayerHeight?: number;
    }

    let { recording, youtubePlayerHeight = 315 }: Props = $props();
</script>

{#if recording.link}
    {#if recording.platform === "youtube"}
        {@const handle = extractYouTubeHandle(recording.link)}
        <iframe
            class="yt-video youtube-preview"
            width="560"
            height={youtubePlayerHeight}
            src="https://www.youtube.com/embed/{handle}"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            loading="lazy"
            allowfullscreen
        ></iframe>
    {:else if recording.platform === "spotify"}
        {@const handle = extractSpotifyHandle(recording.link)}
        <iframe
            class="yt-video youtube-preview"
            width="100%"
            height="352"
            src="https://open.spotify.com/embed/{handle}?utm_source=generator"
            title="Spotify player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            loading="lazy"
            allowfullscreen
        ></iframe>
    {:else}
        <iframe
            width="100%"
            height="300"
            src="https://w.soundcloud.com/player/?url={encodeURIComponent(recording.link)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
            scrolling="no"
            frameborder="no"
            allow="autoplay"
            loading="lazy"
            title="Soundcloud player"
        ></iframe>
    {/if}
{/if}