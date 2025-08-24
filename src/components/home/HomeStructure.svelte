<script lang="ts">
    import LazyImage from "../../ArtistKit/core/components/images/LazyImage.svelte";
    import SocialLinks from "../../ArtistKit/core/components/SocialLinks.svelte";
    import ConcertsList from "../../ArtistKit/modules/concerts/user/components/ConcertsList.svelte";
    import NewsList from "../../ArtistKit/modules/news/user/components/NewsList.svelte";
    import OpenGraph from "../../ArtistKit/core/components/OpenGraph.svelte";
    import type { Result } from "../../utils/result";
    import type { APIConcertPreview, APINewsItem, Paginated, SingleBioPreview } from "../../artkyt/types";

    interface Props {
        shortBio: Result<{ bio: SingleBioPreview }>;
        topNews: Result<Paginated<{ news: APINewsItem[] }>>;
        topConcerts: Result<Paginated<{ concerts: APIConcertPreview[] }>>;

        instrument?: string;
        aboutTitle?: string;
        language?: string;
        bioLoadingText?: string;
        seeBioText?: string;
        newsTitle?: string;
        seeNews?: string;
        concertsTitle?: string;
        seeAllConcertsText?: string;
        seeGalleryText?: string;
    }

    let {
        shortBio,
        topConcerts,
        topNews,

        instrument = "Cellist & composer",
        aboutTitle = "About Cyprien",
        language = "en",
        bioLoadingText = "Loading bio",
        seeBioText = "See Biography",
        newsTitle = "Latest News",
        seeNews = "See All News",
        concertsTitle = "Concerts",
        seeAllConcertsText = "See All Concerts",
        seeGalleryText = "See Gallery",
    }: Props = $props();
</script>

<OpenGraph
    title="Cyprien Lengagne"
    description="Website of the swiss-french cellist and composer Cyprien Lengagne"
    imageUrl="https://cyprienlengagne.com/imgs/Valere_Top.webp"
/>
<div id="home-wrapper">
    <div id="home-bg">
        <LazyImage
            lowresSrc="/imgs/Valere_Top_ultralowres.jpg"
            src="/imgs/Valere_Top.webp"
            observe={false}
            alt="Cyprien Lengagne"
        />
    </div>
    <section class="splash">
        <div class="text">
            <h1 class="name">Cyprien Lengagne</h1>
            <h2 class="instrument">{instrument}</h2>
            <SocialLinks />
        </div>
    </section>

    <div class="grid bg-light">
        <section class="mini-bio backdrop-blur-very-strong bg-very-light">
            <div class="bio-text">
                <h3>{aboutTitle}</h3>

                {#if shortBio.success}
                    <p class="line-breaks">
                        {shortBio.value.bio.content}
                    </p>
                {/if}

                <a href="{language}/bio" class="cta">{seeBioText}</a>
            </div>

            <div class="listen">
                <iframe
                    class="yt-video"
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/xongSVmsbSc"
                    title="YouTube video player"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                ></iframe>
            </div>
        </section>

        <section class="news backdrop-blur-very-strong bg-very-light">
            <h3>{newsTitle}</h3>
            <NewsList newsResult={topNews} lang={language} enableLoadMore={false} />
            <a href="{language}/news" class="cta force-white-bg">{seeNews}</a>
        </section>

        <section class="concerts backdrop-blur-very-strong bg-very-light">
            <h3>{concertsTitle}</h3>
            <ConcertsList
                concertsList={topConcerts.success ? topConcerts.value.concerts : []}
                grouping="off"
            />
            <a href="{language}/concerts" class="cta">{seeAllConcertsText}</a>
        </section>

        <!--

            <section class="gallery backdrop-blur-very-strong bg-very-light">
                <div class="gallery-backdrop">
                    <a href="{language}/media" class="cta-inverted">{ seeGalleryText }</a>
                </div>
            </section>
        -->
    </div>
</div>

<style>
    #home-wrapper {
        position: relative;
    }

    #home-bg {
        position: fixed;
        height: 100svh;
        width: 100%;
        z-index: -1;
    }

    #home-bg :global(.lazy-image) {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center top;
    }

    :global(.animated) #home-bg {
        opacity: 0;
        animation: zoom-out 0.75s ease-out forwards;
    }

    section {
        --padding: min(2rem, 5vw);
        padding: var(--padding);
        box-sizing: border-box;

        transition: 0.2s ease;
    }

    .splash {
        position: relative;
        z-index: 1;
        min-height: 100svh;
    }

    .splash .text {
        position: absolute;
        top: 6rem;
        border-radius: 2rem;

        color: white;

        opacity: 0;
    }

    :global(.animated .splash .text) {
        animation: title-appear 0.6s ease-out 0.6s forwards;
    }

    :global(.animated:not(.first-page)) .splash .text {
        animation-delay: 0.2s;
    }

    .name {
        font-size: min(4rem, 15vw);
        text-shadow:
            0 0 3rem rgba(0, 0, 0, 1),
            0 0 1rem rgba(0, 0, 0, 1);
        margin-bottom: 0.5rem;
    }

    .instrument {
        font-size: min(3rem, 10vw);
        text-shadow:
            0 0 3rem rgba(0, 0, 0, 1),
            0 0 1rem rgba(0, 0, 0, 1);
        margin-top: 1rem;
    }

    @media screen and (max-width: 75rem) {
        .splash {
            background: linear-gradient(
                to top,
                rgba(0, 0, 0, 0.5) 20rem,
                rgba(0, 0, 0, 0) 35rem
            );
        }

        .splash .text {
            top: unset;
            bottom: 2rem;
        }
    }

    .grid {
        display: grid;
        grid-template-areas:
            "mini-bio mini-bio"
            "concerts news";

        box-shadow: 0 -2rem 2rem 2rem rgba(0, 0, 0, 0.4);
    }

    :global(.animated.first-page #home-wrapper .grid) {
        opacity: 0;
        animation: bottom-appear 0.5s ease-out 0.8s forwards;
    }

    :global(.animated:not(.first-page)) #home-wrapper .grid {
        animation-delay: 0.4s;
    }

    .mini-bio {
        grid-area: mini-bio;

        display: grid;
        grid-template-areas: "bio-text listen";
        grid-template-columns: 3fr 2fr;
        gap: 2rem;
    }

    .bio-text {
        grid-area: bio-text;
    }

    .listen {
        grid-area: listen;
    }

    @media screen and (max-width: 75rem) {
        .grid {
            grid-template-areas:
                "mini-bio"
                "news"
                "concerts";
        }
        .mini-bio {
            grid-template-columns: 1fr;
            grid-template-areas:
                "bio-text"
                "listen";
            grid-template-rows: min-content min-content;
            gap: 3rem;
        }

        .yt-video {
            --max-width: calc(100vw - 2 * var(--padding));
            max-width: var(--max-width);
            max-height: calc(var(--max-width) * 9 / 16);
        }
    }

    h3 {
        margin-top: 0;
    }

    .news {
        grid-area: news;
        background-color: var(--color-primary-super-light);
    }

    .concerts {
        grid-area: concerts;
    }

    /* .gallery {
        background-image: url("/imgs/Portrait1.jpg");
        background-size: cover;
        background-position: center;
        padding: 0;
        height: 40rem;
    }

    .gallery-backdrop {
        background-color: var(--color-primary-light);
        min-height: 15rem;
        height: 100%;
        box-sizing: border-box;
        padding: 2rem;

        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
    } */
</style>
