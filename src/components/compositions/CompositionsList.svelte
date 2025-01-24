<script lang="ts">
    import { compositionsManager } from "../../stores/compositions.svelte";
    import { Status } from "../../types/status";
    import { categoryByLanguage } from "../../utils/compositionUtils";
    import LoadingSpinner from "../utils/LoadingSpinner.svelte";

    interface Props {
        maxCount?: number;
        expandedMax?: number;
        lang?: string;
        loadMoreText?: string;
        premiereText?: string;
        allCategoryText?: string;
        noPieceInCategoryText?: string;
    }

    let {
        maxCount = $bindable(-1),
        expandedMax = 100,
        lang = "en",
        loadMoreText = "Load more",
        premiereText = "Premiere",
        allCategoryText = "All",
        noPieceInCategoryText = "There are no pieces within this category"
    }: Props = $props();

    let loadingMore: boolean = $state(false);

    const dateFormatter = new Intl.DateTimeFormat(lang, {
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    let currentCategory = $state("all");

    async function loadMore() {
        if (maxCount === -1) return;

        if (maxCount < compositionsManager.compositions.items.length) {
            maxCount = compositionsManager.compositions.items.length;
            return;
        }

        loadingMore = true;
        await compositionsManager.updateCompositions(expandedMax);
        maxCount = expandedMax;
        loadingMore = false;
    }

    let truncatedCompositions = $derived(maxCount < 0 ? compositionsManager.compositions.items : compositionsManager.compositions.items.slice(0, maxCount));
    let filteredCompositions = $derived.by(() => {
        if (currentCategory === "all") return truncatedCompositions;

        return truncatedCompositions.filter((composition) => composition.category === currentCategory);
    });
</script>

{#if compositionsManager.compositions.status === Status.OK}
    <div class="filters">
        {#each ["all", ...compositionsManager.availableCompositionCategories] as category}
            <button
                class="{currentCategory === category ? 'cta-inverted' : 'cta'}"
                onclick={() => currentCategory = category}
            >
                { categoryByLanguage[lang][category] ?? allCategoryText }
            </button>
        {/each}
    </div>

    <div>
        {#each filteredCompositions as composition}
            <div class="composition">
                <div>
                    <h4>{ composition.name } ({ (new Date(composition.compositionDate)).getFullYear() })</h4>
                    <div class="category">{categoryByLanguage[lang][composition.category]}</div>
                    <div class="composition-optional">
                        {#if composition.duration}
                            <div>
                                <img src="/icons/clock.svg" alt="Clock" class="icon" />
                                <span>{ composition.duration }</span>
                            </div>
                        {/if}
                        {#if composition.instrumentation}
                            <div>
                                <img src="/icons/violin.svg" alt="Violin" class="icon" />
                                <span>{ composition.instrumentation }</span>
                            </div>
                        {/if}
                    </div>

                    {#if composition.premiered}
                        <div class="premiere">
                            <h5>{ premiereText }</h5>

                            <div>
                                <img src="/icons/calendar.svg" alt="Calendar" class="icon" />
                                <span>{ dateFormatter.format(composition.premiereDate) }</span>
                            </div>
                            <div>
                                <img src="/icons/map_marker.svg" alt="Map marker" class="icon" />
                                <span>{ composition.premiereLocation }</span>
                            </div>
                            {#if composition.premierePerformers}
                                <div>
                                    <img src="/icons/music.svg" alt="Music" class="icon" />
                                    <span>{ composition.premierePerformers }</span>
                                </div>
                            {/if}
                        </div>
                    {/if}

                    <p>{composition.lingualDescriptions[lang] ?? composition.description}</p>
                </div>
                <div class="video-container">
                    {#if composition.recordingVideo}
                        <iframe class="yt-video youtube-preview" width="320" height="180" src="https://www.youtube.com/embed/{composition.recordingVideo}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    {/if}
                </div>
            </div>
        {:else}
            <p>{ noPieceInCategoryText }</p>
        {/each}
    </div>

    {#if loadingMore}
        <LoadingSpinner message="Loading more news" />
    {:else if maxCount !== -1 && maxCount < expandedMax && compositionsManager.compositions.total > maxCount}
        <button class="cta" onclick={loadMore}>{ loadMoreText }</button>
    {/if}
{:else if compositionsManager.compositions.status === Status.FAILED}
    <p>An error occured while fetching compositions</p>
{:else if compositionsManager.compositions.status === Status.PENDING}
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
        font-size: 1.5rem;
    }

    h5 {
        margin: 0.5rem 0 0.25rem 0;
        font-size: 1rem;
    }

    p {
        margin: 1rem 0;
    }

    
    .composition-optional > div, .premiere > div {
        display: flex;
        gap: 0.25rem;
        align-items: center;
        font-size: 0.9rem;
    }

    .icon {
        height: 1rem;
        width: 1rem;
    }

    .filters {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;

        margin-bottom: 2rem;
    }
</style>