<script lang="ts">
    import PageStructure from "../../../components/PageStructure.svelte";
    import NewsList from "../../../components/news/NewsList.svelte";
</script>

<PageStructure
    title="News"
    bgImgName="PendereckiWinnerConcert.jpg"
    bgSize="max(100vw, 1200px)"
    bgPositionX="right"
    bgPositionY="max(-20rem, -15vw)"
    bgPositionMobileX="40rem"
    bgPositionMobileY="-22rem"
    layout="content-only"
>
    <NewsList lang="fr" loadMoreText="Afficher plus" />
</PageStructure>