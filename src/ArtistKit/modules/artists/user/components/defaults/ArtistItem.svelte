<script lang="ts">
    import { page } from "$app/state";
    import LazyImage from "../../../../../core/components/images/LazyImage.svelte";
    import { urlHost } from "../../../../../core/utils/stringUtils";
    import type { Artist } from "../../../artistsManager.svelte";

    interface Props {
        artist: Artist;
    }

    let { artist }: Props = $props();

    let bio = $derived.by(() => {
        const lang = page.url.pathname.split("/")[1];
        return artist.lingualBio[lang] ?? artist.bio;
    });

</script>

<div class="artist-item">
    <div class="image">
        <LazyImage src={artist.image.url} lowresSrc={artist.thumbnail.url} />
    </div>
    <div class="details">
        <h3>{artist.name}</h3>
        <div>{artist.role}</div>

        <p>{bio}</p>

        {#if artist.websiteUrl}
            <a href={artist.websiteUrl} class="cta">{urlHost(artist.websiteUrl)}</a>
        {/if}
    </div>
</div>

<style>

    .artist-item {
        display: grid;
        gap: 1rem;

        grid-template-areas: "image details";
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr;
    }

    @media screen and (max-width: 768px) {
        .artist-item {
            grid-template-areas:
                "image"
                "details";
            grid-template-rows: 1fr 1fr;
            grid-template-columns: 1fr;
        }
    }

    .image {
        grid-area: image;
    }

    .details {
        grid-area: details;
    }

</style>