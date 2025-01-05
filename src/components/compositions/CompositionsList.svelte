<script lang="ts">
    import { compositions, updateCompositions } from "../../stores/compositions";
    import { Status } from "../../types/status";
    import { categoryByLanguage } from "../../utils/compositionUtils";
    import LoadingSpinner from "../utils/LoadingSpinner.svelte";

    const defaultPremiereGenerator = (dateText: string, performersText: string, locationText: string) => `Premiered on ${dateText} by ${performersText} at ${locationText}`;

    export let maxCount: number = -1;
    export let expandedMax: number = 100;
    export let lang: string = "en";
    export let loadMoreText: string = "Load more";
    export let premiereTextGenerator: typeof defaultPremiereGenerator = defaultPremiereGenerator;

    let loadingMore: boolean = false;

    const dateFormatter = new Intl.DateTimeFormat(lang, {
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    async function loadMore() {
        if (maxCount === -1) return;

        if (maxCount < $compositions.compositions.length) {
            maxCount = $compositions.compositions.length;
            return;
        }

        loadingMore = true;
        await updateCompositions(expandedMax);
        maxCount = expandedMax;
        loadingMore = false;
    }

    $: truncatedNews = maxCount < 0 ? $compositions.compositions : $compositions.compositions.slice(0, maxCount);
</script>

{#if $compositions.status === Status.OK}
    <div>
        {#each truncatedNews as composition}
            <div class="composition">
                <div>
                    <h4>{ composition.name }</h4>
                    <div class="category">{categoryByLanguage[lang][composition.category]}</div>
                    <p>{composition.description}</p>
                    <p class="premiere">{premiereTextGenerator(dateFormatter.format(composition.premiereDate), composition.premierePerformers, composition.premiereLocation)}</p>
                </div>
                <div class="video-container">
                    {#if composition.recordingVideo}
                        <iframe class="yt-video youtube-preview" width="320" height="180" src="https://www.youtube.com/embed/{composition.recordingVideo}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    {/if}
                </div>
            </div>
        {/each}
    </div>

    {#if loadingMore}
        <LoadingSpinner message="Loading more news" />
    {:else if maxCount !== -1 && maxCount < expandedMax && $compositions.total > maxCount}
        <button class="cta" on:click={loadMore}>{ loadMoreText }</button>
    {/if}
{:else if $compositions.status === Status.FAILED}
    <p>An error occured while fetching compositions</p>
{:else if $compositions.status === Status.PENDING}
    <LoadingSpinner message="Loading compositions" />
{/if}


<style>
    .composition {
        margin-bottom: 3rem;

        display: grid;
        gap: 2rem;

        grid-template-columns: 1fr 320px;
        grid-template-rows: min-content;
    }

    @media screen and (max-width: 768px) {
        .composition {
            grid-template-columns: 1fr;
            grid-template-rows: min-content min-content;
        }
    }

    h4 {
        margin: 0;
        font-size: 1.25rem;
    }

    p {
        margin: 1rem 0;
    }
</style>