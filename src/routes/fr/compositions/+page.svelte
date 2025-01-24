<script lang="ts">
    import PageStructure from "../../../components/PageStructure.svelte";
    import CompositionsList from "../../../components/compositions/CompositionsList.svelte";
</script>

<PageStructure
    title="Compositions"
    bgImgName="PendereckiResults.webp"
    bgSize="max(100vw, 1200px)"
    bgPositionX="right"
    bgPositionY="-5rem"
    bgPositionMobileX="30rem"
    bgPositionMobileY="-5rem"
    imgName="AmandineLauriol_Jaroussky_Face.webp"
>
    <CompositionsList
        lang="fr"
        loadMoreText="Afficher plus"
        premiereText="Création"
        allCategoryText="Tout"
        noPieceInCategoryText="Il n'y a pas de pièce dans cette catégorie"
    />
</PageStructure>
