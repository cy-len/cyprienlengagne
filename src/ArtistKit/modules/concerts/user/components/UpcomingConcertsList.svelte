<script lang="ts">
    import LoadingSpinner from "../../../../core/components/LoadingSpinner.svelte";
    import { Status } from "../../../../core/types/fetchTypes";
    import { concertsManager } from "../../concertsManager.svelte";
    import ConcertsList from "./ConcertsList.svelte";

    interface Props {
        maxCount?: any;
        expandedMax?: number;
        grouping?: "off" | "month-asc" | "month-desc";
        alwaysShowYearInGroups?: boolean;
    }

    let {
        maxCount = $bindable(-1),
        expandedMax = 200,
        grouping = "month-asc",
        alwaysShowYearInGroups = false
    }: Props = $props();

    let loadingMore: boolean = $state(false);

    async function loadMore() {
        if (maxCount === -1) return;

        if (maxCount < concertsManager.upcoming.items.length) {
            maxCount = concertsManager.upcoming.items.length;
            return;
        }

        loadingMore = true;
        await concertsManager.updateUpcoming(expandedMax);
        maxCount = expandedMax;
        loadingMore = false;
    }
</script>

{#if concertsManager.upcoming.status === Status.OK}
    <ConcertsList concertsList={concertsManager.upcoming.items} maxCount={maxCount} {grouping} {alwaysShowYearInGroups} />

    {#if loadingMore}
        <LoadingSpinner message="Loading more past concerts" />
    {:else if maxCount !== -1 && maxCount < expandedMax && concertsManager.upcoming.total > maxCount}
        <button class="cta" onclick={loadMore}>Load more</button>
    {/if}
{:else if concertsManager.upcoming.status === Status.FAILED}
    <p>An error occured while fetching the upcoming concerts</p>
{:else if concertsManager.upcoming.status === Status.PENDING}
    <LoadingSpinner message="Loading upcoming concerts" />
{/if}
