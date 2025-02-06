<script lang="ts">
    import PageStructure from "../../../components/PageStructure.svelte";
    import ContactForm from "../../../components/contact/ContactForm.svelte";
    import SocialLinks from "../../../components/utils/SocialLinks.svelte";
</script>

<PageStructure
    title="Contact"
    bannerLowresImgName="AmandineLauriol_Jaroussky_ultralowres.jpg"
    bannerImgName="AmandineLauriol_Jaroussky.webp"
    bannerPosition="center center"
    imgLowresName="FromBottom_AmandineLauriol_compressed_ultralowres.jpg"
    imgName="FromBottom_AmandineLauriol_compressed.jpg"
>
    <h2>Social media</h2>

    <SocialLinks text="media" bigIcons={true} />

    <h2>Send me a message</h2>

    <ContactForm />
</PageStructure>
