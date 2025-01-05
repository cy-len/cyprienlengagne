<script lang="ts">
    import type { Concert } from "../../types/concert";
    import { browser } from '$app/environment';
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import ConcertListItem from "./ConcertListItem.svelte";
    import { capitalize } from "../../utils/stringUtils";

    export let concertsList: Concert[];
    export let maxCount = -1;
    export let forceCompact = false;
    export let grouping: "off" | "month-asc" | "month-desc" = "month-asc";
    export let alwaysShowYearInGroups: boolean = false;

    let autoCompact = false;

    const monthFormatter = new Intl.DateTimeFormat($page.url.pathname.split("/")[1] ?? "en", {
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

    $: truncatedConcerts = maxCount > 0 ? concertsList.slice(0, maxCount) : concertsList;
    $: groupedConcertObj = Object.groupBy(truncatedConcerts, (item, i) => `${item.date.getFullYear()}${item.date.getMonth().toString().padStart(2, "0")}`);
    $: groupedConcert = Object.values(groupedConcertObj).filter(g => !!g);

    $: compact = forceCompact || autoCompact;
</script>

<ul class:compact={compact}>
    {#if grouping !== "off" && groupedConcert.length > 1}
        {@const sortedGroups = grouping === "month-desc" ? groupedConcert.toSorted((a, b) => (b[0].date.valueOf() - a[0].date.valueOf())) : groupedConcert}
        
        {#each sortedGroups as group, i}
            {#if group}
                <li class="group-header" class:extra-margin={compact}>
                    <h4>
                        { capitalize(monthFormatter.format(group[0].date)) }
                        {#if alwaysShowYearInGroups || i === 0 || group[0].date.getFullYear() !== sortedGroups[i - 1][0].date.getFullYear()}
                            { group[0].date.getFullYear() }
                        {/if}
                    </h4>
                </li>
                
                {#each group as concert}
                    <li>
                        <ConcertListItem {concert} {compact} />
                    </li>
                {/each}
            {/if}
        {/each}
    {:else}
        {#each truncatedConcerts as concert}
            <li>
                <ConcertListItem {concert} {compact} />
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