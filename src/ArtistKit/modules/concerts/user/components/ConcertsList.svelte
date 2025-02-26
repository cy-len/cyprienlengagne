<script lang="ts">
    import type { Concert } from '../../concertsManager.svelte';
    import { browser } from '$app/environment';
    import { onMount, type Snippet } from "svelte";
    import { page } from "$app/state";
    import ConcertListItem from "./defaults/ConcertListItem.svelte";
    import { capitalize } from "../../../../core/utils/stringUtils";
    import { groupBy } from "../../../../core/utils/objectUtils";

    interface Props {
        concertsList: Concert[];
        maxCount?: any;
        forceCompact?: boolean;
        grouping?: "off" | "month-asc" | "month-desc";
        alwaysShowYearInGroups?: boolean;

        concertItem?: Snippet<[{ concert: Concert, compact: boolean }]>;
    }

    let {
        concertsList,
        maxCount = -1,
        forceCompact = false,
        grouping = "month-asc",
        alwaysShowYearInGroups = false,
        concertItem
    }: Props = $props();

    let autoCompact = $state(false);

    const monthFormatter = new Intl.DateTimeFormat(page.url.pathname.split("/")[1] ?? "en", {
        month: "long"
    });

    onMount(() => {
        if (browser) {
            autoCompact = window.matchMedia("(max-width: 50rem)").matches;
            window.matchMedia("(max-width: 50rem)").addEventListener("change", (ev) => {
                autoCompact = ev.matches;
            });
        }
    });

    let truncatedConcerts = $derived(maxCount > 0 ? concertsList.slice(0, maxCount) : concertsList);
    let groupedConcertObj = $derived(groupBy(truncatedConcerts, (item) => `${item.date.getFullYear()}${item.date.getMonth().toString().padStart(2, "0")}`));
    let groupedConcert = $derived.by(() => {
        const filtered = Object.values(groupedConcertObj).filter(g => !!g);
        if (grouping === "month-desc") {
            filtered.sort((a, b) => (b[0].date.valueOf() - a[0].date.valueOf()));
        }

        return filtered;
    });


    let compact = $derived(forceCompact || autoCompact);
</script>

<ul class:compact={compact}>
    {#if grouping !== "off" && groupedConcert.length > 1}        
        {#each groupedConcert as group, i}
            {#if group}
                <li class="group-header" class:extra-margin={compact}>
                    <h4>
                        { capitalize(monthFormatter.format(group[0].date)) }
                        {#if alwaysShowYearInGroups || i === 0 || group[0].date.getFullYear() !== groupedConcert[i - 1][0].date.getFullYear()}
                            { group[0].date.getFullYear() }
                        {/if}
                    </h4>
                </li>
                
                {#each group as concert}
                    <li>
                        {#if concertItem}
                            {@render concertItem({ concert, compact })}
                        {:else}
                            <ConcertListItem {concert} {compact} />
                        {/if}
                    </li>
                {/each}
            {/if}
        {/each}
    {:else}
        {#each truncatedConcerts as concert}
            <li>
                {#if concertItem}
                    {@render concertItem({ concert, compact })}
                {:else}
                    <ConcertListItem {concert} {compact} />
                {/if}
            </li>
        {/each}
    {/if}
</ul>

<style>

    ul {
        list-style-type: none;
        margin: 1rem 0;
        padding: 0;
    }

    li.extra-margin {
        margin-top: 2rem;
        margin-bottom: 1rem;
    }

    .group-header h4 {
        font-size: 1.25rem;
        margin-top: 1rem;
        margin-bottom: 0.5rem;
    }

</style>