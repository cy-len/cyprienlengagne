<script lang="ts">
    import { onMount, type Snippet } from 'svelte';
    import "../../styles/global.css";
    import Nav from '../../ArtistKit/core/components/nav/Nav.svelte';
    import SocialLinks from '../../ArtistKit/core/components/SocialLinks.svelte';

    interface Props {
        children?: Snippet;
    }

    let { children }: Props = $props();

    onMount(() => {
        document.body.classList.add("animated"); // Prevents animation flashing with SSR
    });
</script>

<Nav />
{@render children?.()}

<footer>
    <p>
        Cyprien Lengagne
    </p>
    <SocialLinks />

    <p>
        Website by Cyprien Lengagne
    </p>
</footer>