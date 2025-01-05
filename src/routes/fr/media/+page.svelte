<script lang="ts">
    import PageStructure from "../../../components/PageStructure.svelte";
    import VideoList from "../../../components/media/VideoList.svelte";
    import Gallery from "../../../components/media/Gallery.svelte";
</script>

<PageStructure title="Médias" bgImgName="JarousskyPapillons.webp" bgPositionY="bottom" bgPositionX="right" layout="content-only">
    <section>
        <h2>Videos</h2>

        <VideoList />
    </section>
    <section>
        <h2>Images</h2>

        <Gallery />
    </section>
</PageStructure>
