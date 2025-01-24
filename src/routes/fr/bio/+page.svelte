<script lang="ts">
    import Biography from "../../../components/bio/Biography.svelte";
    import PageStructure from "../../../components/PageStructure.svelte";
</script>

<PageStructure
    title="Biographie"
    bgImgName="Valere_Back.jpg"
    bgSize="max(100vw, 1200px)"
    bgPositionY="-75px"
    bgPositionMobileX="-25rem"
    imgName="Valere_Front_Vertical.jpg"
>
    <Biography lang="fr" downloadText="Télécharger la biographie" />
</PageStructure>