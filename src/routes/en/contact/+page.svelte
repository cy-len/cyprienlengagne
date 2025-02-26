<script lang="ts">
    import SocialLinks from "../../../ArtistKit/core/components/SocialLinks.svelte";
    import ContactForm from "../../../ArtistKit/modules/contact/user/components/ContactForm.svelte";
    import PageStructure from "../../../components/PageStructure.svelte";
</script>

<PageStructure
    title="Contact"
    bannerLowresImgName="AmandineLauriol_Jaroussky_ultralowres.jpg"
    bannerImgName="AmandineLauriol_Jaroussky.webp"
    bannerPosition="center center"
    bannerMobilePosition="-28rem center"
    imgLowresName="FromBottom_AmandineLauriol_compressed_ultralowres.jpg"
    imgName="FromBottom_AmandineLauriol_compressed.jpg"
>
    <h2>Social media</h2>

    <SocialLinks text="media" bigIcons={true} />

    <h2>Send me a message</h2>

    <ContactForm />
</PageStructure>
