<script lang="ts">
    import type { Snippet } from 'svelte';
    import "../../styles/global.css";
    import Nav from '../../components/Nav.svelte';
    import SocialLinks from '../../ArtistKit/core/components/SocialLinks.svelte';

    interface Props {
        children?: Snippet;
    }

    let { children }: Props = $props();
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