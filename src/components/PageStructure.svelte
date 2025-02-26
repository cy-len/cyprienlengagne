<script lang="ts">
    import { setContext, type Snippet } from "svelte";
    import LazyImage from "../ArtistKit/core/components/images/LazyImage.svelte";
    import {
        setOpenGraph,
        type OpenGraphProps,
    } from "../ArtistKit/core/utils/openGraphManager";

    interface Props {
        title?: string;

        bannerImgName?: string;
        bannerLowresImgName?: string;
        bannerWidth?: string;
        bannerPosition?: string;
        bannerMobilePosition?: string;
        bannerAnchor?: "left" | "right";

        imgName?: string;
        imgLowresName?: string;
        imgAlt?: string;
        layout?: "image-left" | "image-right" | "content-only";

        children?: Snippet;
    }

    let {
        title = "",

        bannerImgName = "Valere_Back.jpg",
        bannerLowresImgName,
        bannerWidth = "max(100vw, 1200px)",
        bannerPosition = "center center",
        bannerMobilePosition = "center center",
        bannerAnchor = "left",

        imgName = "",
        imgLowresName,
        imgAlt = "Cyprien Lengagne",
        layout = "image-left",

        children,
    }: Props = $props();

    setOpenGraph({
        title,
        description:
            "Website of the swiss-french cellist and composer Cyprien Lengagne",
        imageUrl: `https://cyprienlengagne.com/imgs/${bannerImgName}`,
    });
</script>

<div class="page-structure">
    <header
        style="--banner-width: {bannerWidth}; --banner-pos: {bannerPosition}; --banner-mobile-pos: {bannerMobilePosition};"
        class={{
            "anchor-left": bannerAnchor === "left",
            "anchor-right": bannerAnchor === "right",
        }}
    >
        <LazyImage
            lowresSrc={bannerLowresImgName
                ? `/imgs/${bannerLowresImgName}`
                : undefined}
            src="/imgs/{bannerImgName}"
            alt="background"
        />
    </header>

    <main>
        <h1>{title}</h1>
        <div class="page-content backdrop-blur-very-strong bg-very-light">
            <div class="grid {layout}">
                {#if layout !== "content-only"}
                    <div class="picture">
                        <LazyImage
                            lowresSrc={imgLowresName
                                ? `/imgs/${imgLowresName}`
                                : undefined}
                            src="/imgs/{imgName}"
                            alt={imgAlt}
                        />
                    </div>
                {/if}
                <div class="content">
                    {@render children?.()}
                </div>
            </div>
        </div>
    </main>
</div>

<style>
    .page-structure {
        --picture-space: 30rem;
    }

    header {
        position: relative;

        overflow: hidden;
        max-height: var(--picture-space);
    }

    header.anchor-left :global(.lazy-image) {
        left: 0;
    }

    header.anchor-right :global(.lazy-image) {
        right: 0;
    }

    header :global(.lazy-image) {
        position: fixed;
        display: block;
        z-index: -1;
        top: 0;

        width: var(--banner-width);
        object-position: var(--banner-pos);
    }

    main {
        padding-top: var(--picture-space);
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
        header :global(.lazy-image) {
            object-position: var(--banner-mobile-pos);
        }

        .grid.image-left,
        .grid.image-right {
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

    .picture :global(img) {
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
