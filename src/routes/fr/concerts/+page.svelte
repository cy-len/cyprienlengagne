<script lang="ts">
    import PageStructure from "../../../components/PageStructure.svelte";
    import UpcomingConcertList from "../../../components/concerts/UpcomingConcertsList.svelte";
    import PastConcertsList from "../../../components/concerts/PastConcertsList.svelte";
</script>

<PageStructure
    title="Concerts"
    bannerLowresImgName="PendereckiSecondRound_ultralowres.webp"
    bannerImgName="PendereckiSecondRound.webp"
    bannerWidth="max(100vw, 1200px)"
    bannerPosition="left calc(-5rem - 5vw)"
    bannerMobilePosition="-8rem -10rem"
    imgName="Zimmermann_Vertical.webp"
    imgLowresName="Zimmermann_Vertical_ultralowres.webp"
>
    <h2>Prochains concerts</h2>
    <UpcomingConcertList />

    <h2 class="extra-top-margin">Concerts passés</h2>
    <PastConcertsList maxCount={10} loadMoreText="Voir plus" />
</PageStructure>