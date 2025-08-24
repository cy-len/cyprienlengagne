<script>
    import HomeStructure from "../../components/home/HomeStructure.svelte";

    let { data } = $props();

</script>

<HomeStructure
    shortBio={data.shortBio}
    topNews={data.topNews}
    topConcerts={data.topConcerts}

    instrument="Violoncelliste & Compositeur"
    aboutTitle="À propos de Cyprien"
    language="fr"
    bioLoadingText="Chargement de la biographie"
    seeBioText="Voir la biographie"
    newsTitle="Dernières actualités"
    seeNews="Voir toutes les actualités"
    concertsTitle="Concerts"
    seeAllConcertsText="Voir tous les concerts"
    seeGalleryText="Voir la gallerie"
/>
