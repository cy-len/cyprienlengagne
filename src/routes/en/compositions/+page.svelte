<script lang="ts">
    import CompositionsList from "../../../ArtistKit/modules/compositions/user/components/CompositionsList.svelte";
    import PageStructure from "../../../components/PageStructure.svelte";
</script>

<PageStructure
    title="Compositions"
    bannerLowresImgName="PendereckiResults_ultralowres.jpg"
    bannerImgName="PendereckiResults.webp"
    bannerWidth="max(100vw, 1200px)"
    bannerAnchor="right"
    bannerPosition="right -12rem"
    bannerMobilePosition="8rem -5rem"
    imgLowresName="AmandineLauriol_Jaroussky_Face_ultralowres.jpg"
    imgName="AmandineLauriol_Jaroussky_Face.webp"
>
    <CompositionsList />
</PageStructure>