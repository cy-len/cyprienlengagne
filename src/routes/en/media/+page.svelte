<script lang="ts">
    import Gallery from "../../../ArtistKit/modules/gallery/user/components/Gallery.svelte";
    import VideoList from "../../../ArtistKit/modules/videos/user/components/VideoList.svelte";
    import PageStructure from "../../../components/PageStructure.svelte";
</script>

<PageStructure
    title="Media"
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

        <VideoList />
    </section>
    <section>
        <h2>Images</h2>

        <Gallery />
    </section>
</PageStructure>
