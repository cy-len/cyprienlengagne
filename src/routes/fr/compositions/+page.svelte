<script lang="ts">
    import PageStructure from "../../../components/PageStructure.svelte";
    import CompositionsList from "../../../components/compositions/CompositionsList.svelte";
</script>

<PageStructure
    title="Compositions"
    bgImgName="PendereckiResults.webp"
    bgPositionX="right"
    bgPositionY="-15rem"
    bgPositionMobileX="right"
    bgPositionMobileY="-5rem"
    imgName="AmandineLauriol_Jaroussky_Face.webp"
>
    <h2>Compositions</h2>

    <CompositionsList
        lang="fr"
        loadMoreText="Afficher plus"
        premiereText="Création"
        allCategoryText="Tout"
        noPieceInCategoryText="Il n'y a pas de pièce dans cette catégorie"
    />
</PageStructure>
