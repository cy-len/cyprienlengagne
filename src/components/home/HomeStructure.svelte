<script lang="ts">
    import SocialLinks from "../utils/SocialLinks.svelte";
    import { bios } from "../../stores/bios";
    import LoadingSpinner from "../utils/LoadingSpinner.svelte";
    import { Status } from "../../types/status";
    import { browser } from "$app/environment";
    import NewsList from "../news/NewsList.svelte";
    import ConcertsList from "../concerts/ConcertsList.svelte";
    import { upcomingConcerts } from "../../stores/concerts";
    import { getContext } from "svelte";
    import type { Writable } from "svelte/store";
    import type { OpenGraphProps } from "../../types/openGraphProps";

    export let instrument: string = "Cellist & composer";
    export let aboutTitle: string = "About Cyprien";
    export let language: string = "en";
    export let bioLoadingText: string = "Loading bio";
    export let seeBioText: string = "See Biography";
    export let newsTitle: string = "Latest News";
    export let seeNews: string = "See All News";
    export let concertsTitle: string = "Concerts";
    export let seeAllConcertsText: string = "See All Concerts";
    export let seeGalleryText: string = "See Gallery";

    if (browser) {
        setTimeout(() => {
            document.body.classList.add("no-home-animation");
        }, 2000);
    }
    
    getContext<Writable<OpenGraphProps>>("openGraphProps").set({
        title: `Home`,
        description: "Website of the swiss-french cellist and composer Cyprien Lengagne",
        imageUrl: `https://cyprienlengagne.com/imgs/Valere_Top.webp`
    });
    
</script>

<div id="home-wrapper">
    <div id="home-bg" />
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
                <h3>{ aboutTitle }</h3>
    
                {#if $bios[language].status === Status.PENDING}
                    <LoadingSpinner message={bioLoadingText} />
                {:else}
                    <p class="line-breaks">{ $bios[language].biography.short }</p>
                {/if}
                
                <a href="{language}/bio" class="cta">{ seeBioText }</a>
            </div>

            <div class="listen">
                <iframe class="yt-video" width="560" height="315" src="https://www.youtube.com/embed/xongSVmsbSc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
        </section>
        
        <section class="news backdrop-blur-very-strong bg-very-light">
            <h3>{ newsTitle }</h3>
            <NewsList lang={language} maxCount={3} />
            <a href="{language}/news" class="cta force-white-bg">{ seeNews }</a>
        </section>

        <section class="concerts backdrop-blur-very-strong bg-very-light">
            <h3>{ concertsTitle }</h3>
            <ConcertsList concertsList={$upcomingConcerts.concerts} maxCount={5} grouping="off" />
            <a href="{language}/concerts" class="cta">{ seeAllConcertsText }</a>
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

        background-image: url("/imgs/Valere_Top.webp");
        background-size: cover;
        background-position: top;

        opacity: 0;
    }
    
    :global(.animated) #home-bg {
        animation: zoom-out 0.75s ease-out forwards;
    }

    :global(.animated.no-home-animation) #home-bg {
        opacity: 1;
        animation: none;
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
    
    .animated .splash .text {
        animation: title-appear 0.6s ease-out 0.6s forwards;
    }

    :global(.animated.no-home-animation) .splash .text {
        animation-delay: 0.2s;
    }

    .name {
        font-size: min(4rem, 15vw);
        text-shadow: 0 0 3rem rgba(0, 0, 0, 1), 0 0 1rem rgba(0, 0, 0, 1);
        margin-bottom: 0.5rem;
    }

    .instrument {
        font-size: min(3rem, 10vw);
        text-shadow: 0 0 3rem rgba(0, 0, 0, 1), 0 0 1rem rgba(0, 0, 0, 1);
        margin-top: 1rem;
    }
    
    @media screen and (max-width: 75rem) {
        .splash {
            background: linear-gradient(to top, rgba(0, 0, 0, 0.5) 20rem, rgba(0, 0, 0, 0) 35rem);
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

        opacity: 0;
        box-shadow: 0 -2rem 2rem 2rem rgba(0, 0, 0, 0.4);
    }
    
    .animated #home-wrapper .grid {
        animation: bottom-appear 0.5s ease-out 0.8s forwards;
    }
    
    :global(.animated.no-home-animation) #home-wrapper .grid {
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

    @media screen and (max-width: 65rem) {
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

    .gallery {
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
    }
</style>