<script lang="ts">
    import { onMount } from 'svelte';
    import Nav from '../../components/nav/Nav.svelte';
    import type { NavLinksParams } from '../../components/nav/NavLinks.svelte';
    import SocialLinks from "../../components/utils/SocialLinks.svelte";
    import "../../styles/global.css";

    const navParams: NavLinksParams = {
        langURL: "fr",
        homeText: "Accueil",
        bioText: "Bio",
        newsText: "Actualités",
        concertsText: "Concerts",
        compositionsText: "Compositions",
        mediaText: "Médias",
        contactText: "Contact"
    };

    onMount(() => {
        document.body.classList.add("animated"); // Prevents animation flashing with SSR
    });
</script>

<Nav navParams={navParams} />
<slot />

<footer>
    <p>
        Cyprien Lengagne
    </p>
    <SocialLinks />

    <p>
        Site internet par Cyprien Lengagne
    </p>
</footer>