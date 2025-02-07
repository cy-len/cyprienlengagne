<script lang="ts">
    import PageStructure from "../../../components/PageStructure.svelte";
    import NewsList from "../../../components/news/NewsList.svelte";
</script>

<PageStructure
    title="News"
    bannerLowresImgName="PendereckiWinnerConcert_ultralowres.jpg"
    bannerImgName="PendereckiWinnerConcert.jpg"
    bannerWidth="max(100vw, 1200px)"
    bannerAnchor="right"
    bannerPosition="right max(-20rem, -15vw)"
    bannerMobilePosition="10rem -12rem"
    layout="content-only"
>
    <NewsList maxCount={10} />
</PageStructure>