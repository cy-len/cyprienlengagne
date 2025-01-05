<script lang="ts">
    import { upcomingConcerts, updateUpcomingConcerts } from "../../stores/concerts";
    import { Status } from "../../types/status";
    import ConcertsList from "./ConcertsList.svelte";
    import LoadingSpinner from "../utils/LoadingSpinner.svelte";

    export let maxCount = -1;
    export let expandedMax: number = 200;
    export let grouping: "off" | "month-asc" | "month-desc" = "month-asc";
    export let alwaysShowYearInGroups: boolean = false;

    let loadingMore: boolean = false;

    async function loadMore() {
        if (maxCount === -1) return;

        if (maxCount < $upcomingConcerts.concerts.length) {
            maxCount = $upcomingConcerts.concerts.length;
            return;
        }

        loadingMore = true;
        await updateUpcomingConcerts(expandedMax);
        maxCount = expandedMax;
        loadingMore = false;
    }
</script>

{#if $upcomingConcerts.status === Status.OK}
    <ConcertsList concertsList={$upcomingConcerts.concerts} maxCount={maxCount} {grouping} {alwaysShowYearInGroups} />

    {#if loadingMore}
        <LoadingSpinner message="Loading more past concerts" />
    {:else if maxCount !== -1 && maxCount < expandedMax && $upcomingConcerts.total > maxCount}
        <button class="cta" on:click={loadMore}>Load more</button>
    {/if}
{:else if $upcomingConcerts.status === Status.FAILED}
    <p>An error occured while fetching the upcoming concerts</p>
{:else if $upcomingConcerts.status === Status.PENDING}
    <LoadingSpinner message="Loading upcoming concerts" />
{/if}
