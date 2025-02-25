<script lang="ts">
    import Biography from "../../../ArtistKit/modules/bio/user/components/Biography.svelte";
    import PageStructure from "../../../components/PageStructure.svelte";
</script>

<PageStructure
    title="Biographie"
    bannerLowresImgName="Valere_Back_ultralowres.jpg"
    bannerImgName="Valere_Back.jpg"
    bannerAnchor="right"
    bannerPosition="center bottom"
    bannerMobilePosition="26rem center"
    imgLowresName="Valere_Front_Vertical_ultralowres.jpg"
    imgName="Valere_Front_Vertical.jpg"
>
    <Biography lang="fr" downloadText="Télécharger la biographie" />
</PageStructure>