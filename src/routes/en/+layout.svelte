<script lang="ts">
    import { setContext, type Snippet } from 'svelte';
    import "../../styles/global.css";
    import Nav from '../../components/Nav.svelte';
    import SocialLinks from '../../ArtistKit/core/components/SocialLinks.svelte';
	import type { LayoutProps } from './$types';

    interface Props {
        children?: Snippet;
    }

    let { children, data }: Props & LayoutProps = $props();

    setContext("links", data.links);
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