<script lang="ts">
    import { artkytClient } from "../../../../../artkyt/artkytClient.svelte";
    import { upcomingConcertsFilter, type APIConcertPreview, type Paginated } from "../../../../../artkyt/types";
    import { failure, ok, type Result } from "../../../../../utils/result";
    import LoadingSpinner from "../../../../core/components/LoadingSpinner.svelte";
    import ConcertsList from "./ConcertsList.svelte";

    interface Props {
        concerts: Result<Paginated<{ concerts: APIConcertPreview[] }>>;
        lang: string;
        grouping?: "off" | "month-asc" | "month-desc";
        alwaysShowYearInGroups?: boolean;
    }

    let {
        concerts,
        lang = "en",
        grouping = "month-asc",
        alwaysShowYearInGroups = false,
    }: Props = $props();

    let loadingMore: boolean = $state(false);

    async function loadMore() {
        loadingMore = true;
        const result = await artkytClient.getConcertsList(
            lang,
            upcomingConcertsFilter(),
            {
                page: concerts.success ? (concerts.value.pagination.page + 1) : 0,
                pageSize: concerts.success ? concerts.value.pagination.pageSize : 30,
            },
        );

        if (!result.success) {
            concerts = failure({
                code: "expansion_failed",
                message: "Failed to expand the list",
            });
            loadingMore = false;
            return;
        }

        concerts = ok({
            concerts: concerts.success
                ? [...concerts.value.concerts, ...result.value.concerts]
                : result.value.concerts,
            pagination: {
                page: result.value.pagination.page,
                pageSize: result.value.pagination.pageSize,
            },
        });

        loadingMore = false;
    }
</script>

{#if concerts.success}
    <ConcertsList
        concertsList={concerts.value.concerts}
        {grouping}
        {alwaysShowYearInGroups}
    />

    {#if loadingMore}
        <LoadingSpinner message="Loading more past concerts" />
    {:else}
        <button class="cta" onclick={loadMore}>Load more</button>
    {/if}
{:else}
    <p>An error occured while fetching the upcoming concerts</p>
{/if}
