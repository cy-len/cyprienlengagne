<script lang="ts">
    import { videosManager } from "../../stores/videos.svelte";
    import { Status } from "../../types/status";
    import LoadingSpinner from "../../components/utils/LoadingSpinner.svelte";

    interface Props {
        loadingText?: string;
    }

    let { loadingText = "Loading videos" }: Props = $props();
</script>

{#if videosManager.videos.status === Status.PENDING}
    <LoadingSpinner message={loadingText} />
{:else}
    <div class="video-gallery auto-grid">
        {#each videosManager.videos.items as video}
            <div>
                <iframe class="yt-video" width="560" height="315" src="https://www.youtube.com/embed/{video.youtubeHandle}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                <div class="video-title">{video.title}</div>
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

    .yt-video {
        max-height: var(--player-height);
        margin-bottom: 0.5rem;
    }

    .video-title {
        text-align: center;
    }

</style>