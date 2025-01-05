<script lang="ts">
    import { pastConcerts, updatePastConcerts } from "../../stores/concerts";
    import { Status } from "../../types/status";
    import ConcertsList from "./ConcertsList.svelte";
    import LoadingSpinner from "../utils/LoadingSpinner.svelte";

    export let maxCount: number = -1;
    export let expandedMax: number = 50;
    export let loadMoreText: string = "Load more";
    export let grouping: "off" | "month-asc" | "month-desc" = "month-desc";
    export let alwaysShowYearInGroups: boolean = false;

    let loadingMore: boolean = false;

    async function loadMore() {
        if (maxCount === -1) return;

        if (maxCount < $pastConcerts.concerts.length) {
            maxCount = $pastConcerts.concerts.length;
            return;
        }

        loadingMore = true;
        await updatePastConcerts(expandedMax);
        maxCount = expandedMax;
        loadingMore = false;
    }

</script>

{#if $pastConcerts.status === Status.OK}
    <ConcertsList concertsList={$pastConcerts.concerts} maxCount={maxCount} {grouping} {alwaysShowYearInGroups} />

    {#if loadingMore}
        <LoadingSpinner message="Loading more past concerts" />
    {:else if maxCount !== -1 && maxCount < expandedMax && $pastConcerts.total > maxCount}
        <button class="cta" on:click={loadMore}>{ loadMoreText }</button>
    {/if}
{:else if $pastConcerts.status === Status.FAILED}
    <p>An error occured while fetching the upcoming concerts</p>
{:else if $pastConcerts.status === Status.PENDING}
    <LoadingSpinner message="Loading past concerts" />
{/if}
