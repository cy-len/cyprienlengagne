<script lang="ts">
    import PageStructure from "../../../components/PageStructure.svelte";
    import ContactForm from "../../../components/contact/ContactForm.svelte";
    import SocialLinks from "../../../components/utils/SocialLinks.svelte";
</script>

<PageStructure title="Contact" imgName="FromBottom_AmandineLauriol_compressed.jpg" bgImgName="AmandineLauriol_Jaroussky.webp" bgPositionMobileX="-30rem">
    <h2>Social media</h2>

    <SocialLinks text="media" bigIcons={true} />

    <h2>Send me a message</h2>

    <ContactForm />
</PageStructure>
