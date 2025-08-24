<script lang="ts">
    import type { RecordingPlatformCode } from "../../../../../artkyt/constants/externalPlatforms";
    import RecordingPlayer from "../../../../../artkyt/RecordingPlayer.svelte";
    import type { APIRecording } from "../../../../../artkyt/types";
    import type { Result } from "../../../../../utils/result";

    interface Props {
        recordings: Result<{ recordings: APIRecording[] }>;
        loadingText?: string;
    }

    let { recordings, loadingText = "Loading videos" }: Props = $props();
</script>

{#if recordings.success}
    <div class="video-gallery auto-grid">
        {#each recordings.value.recordings as recording}
            <div>
                <RecordingPlayer platform={recording.platform as RecordingPlatformCode} url={recording.url} />
                <p>{recording.title}</p>
            </div>
        {/each}
    </div>
{/if}

<style>

    .video-gallery {
        --player-max-size: 560px;
        --cell-width: min(90vw, var(--player-max-size));
        --player-height: calc(var(--cell-width) * 9 / 16);
        --cell-height: calc(var(--player-height) + 3rem);
    }

    .video-gallery div {
        text-align: center;
    }

</style>