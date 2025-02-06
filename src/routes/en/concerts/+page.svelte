<script lang="ts">
    import PageStructure from "../../../components/PageStructure.svelte";
    import PastConcertsList from "../../../components/concerts/PastConcertsList.svelte";
    import UpcomingConcertsList from "../../../components/concerts/UpcomingConcertsList.svelte";
</script>

<PageStructure
    title="Concerts"
    bannerLowresImgName="PendereckiSecondRound_ultralowres.webp"
    bannerImgName="PendereckiSecondRound.webp"
    bannerWidth="max(100vw, 1200px)"
    bannerPosition="left calc(-5rem - 5vw)"
    bannerMobilePosition="-8rem 5rem"
    imgName="Zimmermann_Vertical.webp"
    imgLowresName="Zimmermann_Vertical_ultralowres.webp"
>
    <h2>Upcoming concerts</h2>
    <UpcomingConcertsList />

    <h2 class="extra-top-margin">Past concerts</h2>
    <PastConcertsList maxCount={10} />
</PageStructure>