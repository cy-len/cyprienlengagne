<script lang="ts">
    import { setContext } from "svelte";
    import type { OpenGraphProps } from "../types/openGraphProps";

    interface Props {
        title?: string;
        bgImgName?: string;
        bgSize?: string;
        bgPositionX?: string;
        bgPositionY?: string;
        bgPositionMobileX?: string;
        bgPositionMobileY?: string;
        imgName?: string;
        imgAlt?: string;
        layout?: "image-left" | "image-right" | "content-only";
        children?: import('svelte').Snippet;
    }

    let {
        title = "",
        bgImgName = "Valere_Back.jpg",
        bgSize = "cover",
        bgPositionX = "70%",
        bgPositionY = "top",
        bgPositionMobileX = "70%",
        bgPositionMobileY = "top",
        imgName = "",
        imgAlt = "Cyprien Lengagne",
        layout = "image-left",
        children
    }: Props = $props();

    setContext<OpenGraphProps>("openGraphProps", {
        title,
        description: "Website of the swiss-french cellist and composer Cyprien Lengagne",
        imageUrl: `https://cyprienlengagne.com/imgs/${bgImgName}`
    });
</script>

<main style="background-image: url(/imgs/{bgImgName}); --bg-size: {bgSize}; --bg-pos-x: {bgPositionX}; --bg-pos-y: {bgPositionY}; --bg-pos-mobile-x: {bgPositionMobileX}; --bg-pos-mobile-y: {bgPositionMobileY};">
    <h1>{ title }</h1>
    <div class="page-content backdrop-blur-very-strong bg-very-light">
        <div class="grid {layout}">
            {#if layout !== "content-only"}
                <div class="picture">
                    <img src="/imgs/{imgName}" alt="{imgAlt}" />
                </div>
            {/if}
            <div class="content">
                {@render children?.()}
            </div>
        </div>
    </div>
</main>

<style>
    main {
        padding-top: 30rem;

        background-attachment: fixed;

        background-size: var(--bg-size);
        background-position: var(--bg-pos-x) var(--bg-pos-y);
        background-position-x: var(--bg-pos-x);
        background-position-y: var(--bg-pos-y);
    }

    .page-content {
        padding: 1rem;
        box-shadow: 0 -7rem 3rem 2rem rgba(255, 255, 255, 0.5);

        opacity: 0;
    }
    
    :global(.animated) .page-content {
        animation: content-appear 0.5s ease-out forwards;
    }

    .grid {
        display: grid;
        gap: 1rem;
    }
    
    .grid.image-left {
        grid-template-columns: 1fr 2fr;
        grid-template-areas: "picture content";
    }

    .grid.image-right {
        grid-template-columns: 2fr 1fr;
        grid-template-areas: "content picture";
    }

    .grid.content-only {
        grid-template-columns: 1fr;
        grid-template-areas: "content";
    }

    @media screen and (min-width: 768px) {
        .grid.content-only {
            padding: 0 calc(5vw - 1rem);
        }
    }

    @media screen and (max-width: 35rem) {
        main {
            background-position: var(--bg-pos-mobile-x) var(--bg-pos-mobile-y);
            background-position-x: var(--bg-pos-mobile-x);
            background-position-y: var(--bg-pos-mobile-y);
        }
        .grid.image-left, .grid.image-right {
            grid-template-columns: 1fr;
            grid-template-rows: 1fr min-content;
            grid-template-areas:
                "content"
                "picture";
        }
    }

    .picture {
        grid-area: picture;
        position: relative;
    }
    
    .picture img {
        width: 100%;
        position: sticky;
        top: 5rem;
    }

    .content {
        grid-area: content;
    }

    h1 {
        position: relative;
        z-index: 10;
        margin-left: 5vw;

        opacity: 0;
    }
    
    :global(.animated) h1 {
        animation: title-appear 0.6s ease-out 0.2s forwards;
    }
</style>