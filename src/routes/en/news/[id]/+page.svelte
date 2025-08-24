<script lang="ts">
    import PageStructure from "../../../../components/PageStructure.svelte";

    let { data } = $props();
</script>

<PageStructure
    title={data.news.success ? data.news.value.news.title : "News"}
    bannerLowresImgName="PendereckiWinnerConcert_ultralowres.jpg"
    bannerImgName="PendereckiWinnerConcert.jpg"
    imgLowresName={data.news.success ? data.news.value.news.image?.thumbnailUrl : undefined}
    imgName={data.news.success ? data.news.value.news.image?.highQualityUrl : undefined}
    bannerWidth="max(100vw, 1200px)"
    bannerAnchor="right"
    bannerPosition="right max(-20rem, -15vw)"
    bannerMobilePosition="10rem -12rem"
>
    {#if data.news.success}
        <p>{data.news.value.news.content}</p>
    {:else}
        <p>An error occured</p>
    {/if}
</PageStructure>
