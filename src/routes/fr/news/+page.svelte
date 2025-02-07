<script lang="ts">
    import PageStructure from "../../../components/PageStructure.svelte";
    import NewsList from "../../../components/news/NewsList.svelte";
</script>

<PageStructure
    title="News"
    bannerImgName="PendereckiWinnerConcert.jpg"
    bannerWidth="max(100vw, 1200px)"
    bannerAnchor="right"
    bannerPosition="right max(-20rem, -15vw)"
    bannerMobilePosition="10rem -12rem"
    layout="content-only"
>
    <NewsList lang="fr" loadMoreText="Afficher plus" />
</PageStructure>