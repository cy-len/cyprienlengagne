<script lang="ts">
    import { onMount, setContext, type Snippet } from 'svelte';
    import Nav from '../../components/nav/Nav.svelte';
    import SocialLinks from "../../components/utils/SocialLinks.svelte";
    import "../../styles/global.css";

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