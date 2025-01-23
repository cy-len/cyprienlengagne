<script lang="ts">
    import PageStructure from "../../../components/PageStructure.svelte";
    import PastConcertsList from "../../../components/concerts/PastConcertsList.svelte";
    import UpcomingConcertsList from "../../../components/concerts/UpcomingConcertsList.svelte";
</script>

<PageStructure title="Concerts" bgImgName="PendereckiSecondRound.webp" bgPositionX="left" bgPositionY="-15rem" bgPositionMobileX="-8rem" bgPositionMobileY="-5rem" imgName="Zimmermann_Vertical.webp">
    <h2>Upcoming concerts</h2>
    <UpcomingConcertsList />

    <h2 class="extra-top-margin">Past concerts</h2>
    <PastConcertsList maxCount={10} />
</PageStructure>