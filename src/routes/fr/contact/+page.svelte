<script lang="ts">
    import PageStructure from "../../../components/PageStructure.svelte";
    import ContactForm from "../../../components/contact/ContactForm.svelte";
    import SocialLinks from "../../../components/utils/SocialLinks.svelte";
</script>

<PageStructure title="Contact" imgName="FromBottom_AmandineLauriol_compressed.jpg" bgImgName="AmandineLauriol_Jaroussky.webp" bgPositionMobileX="-30rem">
    <h2>Réseaux sociaux</h2>

    <SocialLinks text="media" bigIcons={true} />

    <h2>Contactez-moi</h2>

    <ContactForm
        okMessage="Message envoyé avec succès !"
        errorMessage="Une erreur est survenue lors de l'envoi du message"
        nameFieldLabel="Votre nom"
        emailFieldLabel="Votre adresse email"
        messageFieldLabel="Message"
        sendButtonText="Envoyer"
    />
</PageStructure>
