<script lang="ts">
    import PageStructure from "../../../components/PageStructure.svelte";
    import { bios } from "../../../stores/bios";
</script>

<PageStructure title="Biographie" bgImgName="Valere_Back.jpg" bgPositionY="-75px" imgName="Valere_Front_Vertical.jpg">
    <p class="line-breaks">{ $bios["fr"].biography.full }</p>
</PageStructure>