<script lang="ts">
    import { artkytClient } from "../../../../../artkyt/artkytClient.svelte";
    import type { APINewsItem, Paginated } from "../../../../../artkyt/types";
    import { failure, ok, type Result } from "../../../../../utils/result";
    import LoadingSpinner from "../../../../core/components/LoadingSpinner.svelte";

    interface Props {
        newsResult: Result<Paginated<{ news: APINewsItem[] }>>;
        lang?: string;
        loadMoreText?: string;
        enableLoadMore?: boolean;
    }

    let {
        newsResult,
        lang = "en",
        loadMoreText = "Load more",
        enableLoadMore = true,
    }: Props = $props();

    let loadingMore: boolean = $state(false);

    const dateFormatter = new Intl.DateTimeFormat(lang, {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    async function loadMore() {
        loadingMore = true;
        const result = await artkytClient.getNewsList(lang, {
            page: newsResult.success ? (newsResult.value.pagination.page + 1) : 0,
            pageSize: newsResult.success
                ? newsResult.value.pagination.pageSize
                : 10,
        });

        if (!result.success) {
            newsResult = failure({
                code: "expansion_failed",
                message: "Failed to expand the list",
            });
            loadingMore = false;
            return;
        }

        newsResult = ok({
            news: newsResult.success
                ? [...newsResult.value.news, ...result.value.news]
                : result.value.news,
            pagination: {
                page: result.value.pagination.page,
                pageSize: result.value.pagination.pageSize,
            },
        });

        loadingMore = false;
    }
</script>

{#if newsResult.success}
    <div class="auto-grid sm-center">
        {#each newsResult.value.news as newsItem}
            <a
                class="news"
                href="/{lang}/news/{newsItem.id}"
                style="
                    background-image: url('{newsItem.image?.thumbnailUrl ??
                    newsItem.image?.highQualityUrl ??
                    newsItem.image?.originalQualityUrl ??
                    ''}');
                    --x-offset: {50}%;
                    --y-offset: {50}%;"
            >
                <div class="overlay">
                    <div class="bottom">
                        <h5>
                            {dateFormatter.format(
                                new Date(newsItem.publishedAt),
                            )}
                        </h5>
                        <h4>{newsItem.title}</h4>
                    </div>
                </div>
            </a>
        {/each}
    </div>

    {#if loadingMore}
        <LoadingSpinner message="Loading more news" />
    {:else if enableLoadMore}
        <button class="cta" onclick={loadMore}>{loadMoreText}</button>
    {/if}
{:else}
    <p>{newsResult.error.message}</p>
{/if}

<style>
    .auto-grid {
        --cell-width: 20rem;
        --cell-height: 26rem;

        gap: 2rem;

        margin-bottom: 3rem;
    }

    .news {
        position: relative;
        padding: 0;
        margin: 0;
        outline: none;

        width: var(--cell-width);
        height: var(--cell-height);
        overflow: hidden;

        background-size: cover;
        background-position: var(--x-offset, center) var(--x-offset, center);
        background-position-x: var(--x-offset, center);
        background-position-y: var(--y-offset, center);

        border-radius: 2rem;
        cursor: pointer;

        text-align: left;
        color: black;

        transition: 0.25s;
    }

    .overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(
            to top,
            rgba(255, 255, 255, 0.95),
            rgba(255, 255, 255, 0.85) 6rem,
            rgba(255, 255, 255, 0) 6rem
        );

        display: flex;
        flex-direction: column;
        justify-content: flex-end;

        padding: 1rem;
    }

    h4 {
        margin: 0;
        margin-top: 0.125rem;
        font-size: 1.25rem;
    }

    h5 {
        font-weight: normal;
        margin: 0;
    }

    .auto-grid:has(:global(:hover)) > :not(:hover) {
        opacity: 0.5;
    }

    .news:hover {
        box-shadow: 0 0 1rem rgba(0, 0, 0, 0.25);
    }
</style>
