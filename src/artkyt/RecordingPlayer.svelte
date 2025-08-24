<script lang="ts">
    import {
        getEmbedPlayerUrl,
        type RecordingPlatformCode,
    } from "./constants/externalPlatforms";

    interface Props {
        platform: RecordingPlatformCode;
        url: string;
    }

    let { platform, url }: Props = $props();

    let embedPlayerUrl = $derived(getEmbedPlayerUrl(platform, url));
    let height = $derived.by(() => {
        if (["spotify", "soundcloud"].includes(platform?.toLowerCase()))
            return "152";
        return "315";
    });
</script>

{#if embedPlayerUrl}
    <div class="player">
        {#if platform === "bandcamp"}
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                class="flex gap-2 w-min"
            >
                Check the page on bandcamp
            </a>
        {:else}
            <iframe
                src={embedPlayerUrl}
                title="Preview"
                width="100%"
                {height}
                frameborder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                allowfullscreen
            ></iframe>
        {/if}
    </div>
{/if}

<style>

    .player {
        width: 100%;
        max-width: 560px;
    }

</style>