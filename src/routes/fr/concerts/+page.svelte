<script lang="ts">
    import PageStructure from "../../../components/PageStructure.svelte";
    import SmartConcertList from "../../../components/concerts/SmartConcertList.svelte";
</script>

<PageStructure title="Concerts" bgImgName="Recital4.jpg" bgPositionX="center" bgPositionY="-250px" bgPositionMobileX="60%" bgPositionMobileY="0%" imgName="VerticalCloseUp2.jpg">
    <h2>Prochains concerts</h2>
    <SmartConcertList mode="upcoming" />

    <h2>Concerts passés</h2>
    <SmartConcertList mode="past" />
</PageStructure>