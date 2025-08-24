<script lang="ts">
    import PastConcertsList from "../../../ArtistKit/modules/concerts/user/components/PastConcertsList.svelte";
    import UpcomingConcertsList from "../../../ArtistKit/modules/concerts/user/components/UpcomingConcertsList.svelte";
    import PageStructure from "../../../components/PageStructure.svelte";

    let { data } = $props();
    $inspect(data)
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
    <h2>Upcoming concerts</h2>
    <UpcomingConcertsList concerts={data.upcoming} lang="en" />

    <h2 class="extra-top-margin">Past concerts</h2>
    <PastConcertsList concerts={data.past} lang="en" />
</PageStructure>