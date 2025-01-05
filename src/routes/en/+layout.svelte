<script>
    import { onMount } from 'svelte';
    import Nav from '../../components/nav/Nav.svelte';
    import SocialLinks from "../../components/utils/SocialLinks.svelte";
    import "../../styles/global.css";

    onMount(() => {
        document.body.classList.add("animated"); // Prevents animation flashing with SSR
    });
</script>

<Nav />
<slot />

<footer>
    <p>
        Cyprien Lengagne
    </p>
    <SocialLinks />

    <p>
        Website by Cyprien Lengagne
    </p>
</footer>