<script lang="ts">
    import { newsManager } from "../../stores/news.svelte";
    import type { News } from "../../types/news";
    import { Status } from "../../types/status";
    import NewsModal from "../modals/NewsModal.svelte";
    import LoadingSpinner from "../utils/LoadingSpinner.svelte";

    interface Props {
        maxCount?: number;
        expandedMax?: number;
        lang?: string;
        loadMoreText?: string;
    }

    let {
        maxCount = $bindable(-1),
        expandedMax = 100,
        lang = "en",
        loadMoreText = "Load more"
    }: Props = $props();

    let modal: NewsModal;

    let loadingMore: boolean = $state(false);

    const dateFormatter = new Intl.DateTimeFormat(lang, {
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    function openNews(n: News) {
        modal.show(n);
    }

    async function loadMore() {
        if (maxCount === -1) return;

        if (maxCount < newsManager.news.items.length) {
            maxCount = newsManager.news.items.length;
            return;
        }

        loadingMore = true;
        await newsManager.updateNews(expandedMax);
        maxCount = expandedMax;
        loadingMore = false;
    }

    let truncatedNews = $derived(maxCount < 0 ? newsManager.news.items : newsManager.news.items.slice(0, maxCount));
</script>

{#if newsManager.news.status === Status.OK}
    <div class="auto-grid sm-center">
        {#each truncatedNews as newsItem}
            <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
            <button class="news" style="background-image: url('{newsItem.thumbnailUrl ?? newsItem.imageUrl}');" onclick={() => {openNews(newsItem);}}>
                <div class="overlay">
                    <div class="bottom">
                        <h5>{ dateFormatter.format(newsItem.date) }</h5>
                        <h4>{ newsItem.text[lang].title }</h4>
                    </div>
                </div>
            </button>
        {/each}

        <NewsModal lang={lang} bind:this={modal} />
    </div>

    {#if loadingMore}
        <LoadingSpinner message="Loading more news" />
    {:else if maxCount !== -1 && maxCount < expandedMax && newsManager.news.total > maxCount}
        <button class="cta" onclick={loadMore}>{ loadMoreText }</button>
    {/if}
{:else if newsManager.news.status === Status.FAILED}
    <p>An error occured while fetching news</p>
{:else if newsManager.news.status === Status.PENDING}
    <LoadingSpinner message="Loading news" />
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
        background-position: center;
        
        border-radius: 2rem;
        cursor: pointer;

        text-align: left;

        transition: 0.25s;
    }

    .overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(to top, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85) 7.5rem, rgba(255, 255, 255, 0) 7.5rem);

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