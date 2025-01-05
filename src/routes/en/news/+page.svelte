<script lang="ts">
    import PageStructure from "../../../components/PageStructure.svelte";
    import NewsList from "../../../components/news/NewsList.svelte";
</script>

<PageStructure title="News" bgImgName="PendereckiWinnerConcert.jpg" bgPositionX="right" bgPositionY="-22rem" bgPositionMobileX="40rem" bgPositionMobileY="-22rem" layout="content-only">
    <h2>All News</h2>

    <NewsList maxCount={10} />
</PageStructure>