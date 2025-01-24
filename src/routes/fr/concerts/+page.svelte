<script lang="ts">
    import PageStructure from "../../../components/PageStructure.svelte";
    import UpcomingConcertList from "../../../components/concerts/UpcomingConcertsList.svelte";
    import PastConcertsList from "../../../components/concerts/PastConcertsList.svelte";
</script>

<PageStructure
    title="Concerts"
    bgImgName="PendereckiSecondRound.webp"
    bgSize="max(100vw, 1200px)"
    bgPositionX="left"
    bgPositionY="calc(-5rem - 5vw)"
    bgPositionMobileX="-8rem"
    bgPositionMobileY="-5rem"
    imgName="Zimmermann_Vertical.webp"
>
    <h2>Prochains concerts</h2>
    <UpcomingConcertList />

    <h2 class="extra-top-margin">Concerts passés</h2>
    <PastConcertsList maxCount={10} loadMoreText="Voir plus" />
</PageStructure>