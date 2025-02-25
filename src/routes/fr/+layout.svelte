<script lang="ts">
    import { onMount, type Snippet } from 'svelte';
    import "../../styles/global.css";
    import Nav from '../../ArtistKit/core/components/nav/Nav.svelte';
    import type { NavLinksParams } from '../../ArtistKit/core/components/nav/NavLinks.svelte';
    import SocialLinks from '../../ArtistKit/core/components/SocialLinks.svelte';
    
    interface Props {
        children?: Snippet;
    }

    let { children }: Props = $props();

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
{@render children?.()}

<footer>
    <p>
        Cyprien Lengagne
    </p>
    <SocialLinks />

    <p>
        Site internet par Cyprien Lengagne
    </p>
</footer>