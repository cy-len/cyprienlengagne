<script lang="ts">
    import PageStructure from "../../../components/PageStructure.svelte";
    import NewsList from "../../../components/news/NewsList.svelte";
</script>

<PageStructure title="News" bgImgName="PendereckiWinnerConcert.jpg" bgPositionX="right" bgPositionY="-22rem" bgPositionMobileX="40rem" bgPositionMobileY="-22rem" layout="content-only">
    <h2>Toutes les actualités</h2>
    <NewsList lang="fr" loadMoreText="Afficher plus" />
</PageStructure>