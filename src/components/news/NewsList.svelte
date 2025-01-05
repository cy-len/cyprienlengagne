<script lang="ts">
    import { news, updateNews } from "../../stores/news";
    import type { News } from "../../types/news";
    import { Status } from "../../types/status";
    import NewsModal from "../modals/NewsModal.svelte";
    import LoadingSpinner from "../utils/LoadingSpinner.svelte";

    export let maxCount: number = -1;
    export let expandedMax: number = 100;
    export let lang: string = "en";
    export let loadMoreText: string = "Load more";

    let modal: NewsModal;

    let loadingMore: boolean = false;

    const dateFormatter = new Intl.DateTimeFormat(lang, {
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    function openNews(n: News) {
        modal.show(n);
    }

    function keyDown(e: KeyboardEvent, n: News) {
        if (e.key === "Enter") {
            openNews(n);
        }
    }

    async function loadMore() {
        if (maxCount === -1) return;

        if (maxCount < $news.news.length) {
            maxCount = $news.news.length;
            return;
        }

        loadingMore = true;
        await updateNews(expandedMax);
        maxCount = expandedMax;
        loadingMore = false;
    }

    $: truncatedNews = maxCount < 0 ? $news.news : $news.news.slice(0, maxCount);
</script>

{#if $news.status === Status.OK}
    <div class="auto-grid sm-center">
        {#each truncatedNews as newsItem}
            <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
            <div class="news" style="background-image: url('{newsItem.imageUrl}');" tabindex="0" on:keydown={(e) => {keyDown(e, newsItem);}} on:click={() => {openNews(newsItem);}}>
                <div class="overlay">
                    <div class="bottom">
                        <h5>{ dateFormatter.format(newsItem.date) }</h5>
                        <h4>{ newsItem.text[lang].title }</h4>
                    </div>
                </div>
            </div>
        {/each}

        <NewsModal lang={lang} bind:this={modal} />
    </div>

    {#if loadingMore}
        <LoadingSpinner message="Loading more news" />
    {:else if maxCount !== -1 && maxCount < expandedMax && $news.total > maxCount}
        <button class="cta" on:click={loadMore}>{ loadMoreText }</button>
    {/if}
{:else if $news.status === Status.FAILED}
    <p>An error occured while fetching news</p>
{:else if $news.status === Status.PENDING}
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

        width: var(--cell-width);
        height: var(--cell-height);

        background-size: cover;
        background-position: center;

        overflow: hidden;

        cursor: pointer;

        border-radius: 2rem;

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

    .auto-grid:has(:hover) > :not(:hover) {
        opacity: 0.5;
    }

    .news:hover {
        box-shadow: 0 0 1rem rgba(0, 0, 0, 0.25);
    }

</style>