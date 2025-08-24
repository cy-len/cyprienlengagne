<script lang="ts">
    import CompositionsList from "../../../ArtistKit/modules/compositions/user/components/CompositionsList.svelte";
    import PageStructure from "../../../components/PageStructure.svelte";

    let { data } = $props();
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
    <CompositionsList
        compositions={data.compositions}
        lang="fr"
        premiereText="Création"
        allCategoryText="Tout"
        noPieceInCategoryText="Il n'y a pas de pièce dans cette catégorie"
    />
</PageStructure>
