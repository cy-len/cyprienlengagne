<script lang="ts">
    import LoadingSpinner from "../../../../core/components/LoadingSpinner.svelte";
    import { Status } from "../../../../core/types/fetchTypes";
    import { concertsManager } from "../../concertsManager.svelte";
    import ConcertsList from "./ConcertsList.svelte";

    interface Props {
        maxCount?: number;
        expandedMax?: number;
        loadMoreText?: string;
        grouping?: "off" | "month-asc" | "month-desc";
        alwaysShowYearInGroups?: boolean;
    }

    let {
        maxCount = $bindable(-1),
        expandedMax = 50,
        loadMoreText = "Load more",
        grouping = "month-desc",
        alwaysShowYearInGroups = false
    }: Props = $props();

    let loadingMore: boolean = $state(false);

    async function loadMore() {
        if (maxCount === -1) return;

        if (maxCount < concertsManager.past.items.length) {
            maxCount = concertsManager.past.items.length;
            return;
        }

        loadingMore = true;
        await concertsManager.updatePast(expandedMax);
        maxCount = expandedMax;
        loadingMore = false;
    }

</script>

{#if concertsManager.past.status === Status.OK}
    <ConcertsList concertsList={concertsManager.past.items} maxCount={maxCount} {grouping} {alwaysShowYearInGroups} />

    {#if loadingMore}
        <LoadingSpinner message="Loading more past concerts" />
    {:else if maxCount !== -1 && maxCount < expandedMax && concertsManager.past.total > maxCount}
        <button class="cta" onclick={loadMore}>{ loadMoreText }</button>
    {/if}
{:else if concertsManager.past.status === Status.FAILED}
    <p>An error occured while fetching the upcoming concerts</p>
{:else if concertsManager.past.status === Status.PENDING}
    <LoadingSpinner message="Loading past concerts" />
{/if}
