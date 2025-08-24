<script lang="ts">
    import Gallery from "../../../ArtistKit/modules/gallery/user/components/Gallery.svelte";
    import VideoList from "../../../ArtistKit/modules/videos/user/components/VideoList.svelte";
    import PageStructure from "../../../components/PageStructure.svelte";

    let { data } = $props();
</script>

<PageStructure
    title="Médias"
    bannerLowresImgName="JarousskyPapillons_ultralowres.jpg"
    bannerImgName="JarousskyPapillons.webp"
    bannerWidth="max(100vw, 1200px)"
    bannerAnchor="right"
    bannerPosition="right -80px"
    bannerMobilePosition="12rem -80px"
    layout="content-only"
>
    <section>
        <h2>Videos</h2>

        <VideoList recordings={data.recordings} />
    </section>
    <section>
        <h2>Images</h2>

        <Gallery gallery={data.gallery} />
    </section>
</PageStructure>
