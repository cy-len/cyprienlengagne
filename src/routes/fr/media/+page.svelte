<script lang="ts">
    import PageStructure from "../../../components/PageStructure.svelte";
    import VideoList from "../../../components/media/VideoList.svelte";
    import Gallery from "../../../components/media/Gallery.svelte";
</script>

<PageStructure
    title="Médias"
    bannerLowresImgName="JarousskyPapillons_ultralowres.jpg"
    bannerImgName="JarousskyPapillons.webp"
    bannerWidth="max(100vw, 1200px)"
    bannerAnchor="right"
    bannerPosition="right -80px"
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
