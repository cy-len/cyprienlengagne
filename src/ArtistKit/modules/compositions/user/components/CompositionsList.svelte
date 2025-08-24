<script lang="ts">
    import type { APIComposition, Paginated } from "../../../../../artkyt/types";
    import type { Result } from "../../../../../utils/result";
    import RecordingPlayer from "../../../../../artkyt/RecordingPlayer.svelte";
    import { categoryByLanguage, type CompositionTypeCode } from "../../compositionUtils";
    import type { RecordingPlatformCode } from "../../../../../artkyt/constants/externalPlatforms";

    interface Props {
        compositions: Result<Paginated<{ compositions: APIComposition[] }>>;
        lang?: string;
        premiereText?: string;
        allCategoryText?: string;
        noPieceInCategoryText?: string;
    }

    let {
        compositions,
        lang = "en",
        premiereText = "Premiere",
        allCategoryText = "All",
        noPieceInCategoryText = "There are no pieces within this category"
    }: Props = $props();

    const dateFormatter = new Intl.DateTimeFormat(lang, {
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    let currentCategory = $state("all");

    let availableCategories = $derived.by(() => {
        if (!compositions.success) return [];

        return Array.from(new Set(compositions.value.compositions.map(c => c.category)));
    })

    let filteredCompositions = $derived.by(() => {
        if (!compositions.success) return [];

        if (currentCategory === "all") return compositions.value.compositions;

        return compositions.value.compositions.filter((composition) => composition.category === currentCategory);
    });
</script>

{#if compositions.success}
    <div class="filters">
        {#each ["all", ...availableCategories] as category}
            <button
                class="{currentCategory === category ? 'cta-inverted' : 'cta'}"
                onclick={() => currentCategory = category}
            >
                { categoryByLanguage[lang][category as CompositionTypeCode] ?? allCategoryText }
            </button>
        {/each}
    </div>

    <div>
        {#each filteredCompositions as composition}
            <div class="composition">
                <div>
                    <h4>{ composition.title } ({ composition.compositionYear })</h4>
                    <div class="category">{categoryByLanguage[lang][composition.category as CompositionTypeCode]}</div>
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

                    {#if composition.hasBeenPremiered}
                        <div class="premiere">
                            <h5>{ premiereText }</h5>

                            {#if composition.premiereDate}
                                <div>
                                    <img src="/icons/calendar.svg" alt="Calendar" class="icon" />
                                    <span>
                                        { dateFormatter.format(new Date(composition.premiereDate)) }
                                    </span>
                                </div>
                            {/if}
                            {#if composition.premiereLocation}
                                <div>
                                    <img src="/icons/map_marker.svg" alt="Map marker" class="icon" />
                                    <span>{ composition.premiereLocation }</span>
                                </div>
                            {/if}
                            {#if composition.premierePerformers}
                                <div>
                                    <img src="/icons/music.svg" alt="Music" class="icon" />
                                    <span>{ composition.premierePerformers }</span>
                                </div>
                            {/if}
                        </div>
                    {/if}

                    <p>{composition.description}</p>
                </div>
                
                <div class="recordings-container">
                    {#each composition.recordings as recording}
                        <RecordingPlayer platform={recording.platform as RecordingPlatformCode} url={recording.url} />
                    {/each}
                </div>
            </div>
        {:else}
            <p>{ noPieceInCategoryText }</p>
        {/each}
    </div>
{:else}
    <p>An error occured while fetching compositions</p>
{/if}


<style>
    .composition {
        margin-bottom: 3rem;

        display: grid;
        gap: 2rem;

        grid-template-columns: 1fr 320px;
        grid-template-rows: min-content;
    }

    @media screen and (max-width: 1100px) {
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