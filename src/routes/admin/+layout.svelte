<script lang="ts">
    import { onMount, setContext, type Snippet } from 'svelte';
    import Nav from '../../components/nav/Nav.svelte';
    import SocialLinks from "../../components/utils/SocialLinks.svelte";
    import LoginForm from "../../components/admin/LoginForm.svelte";
    import PageStructure from "../../components/PageStructure.svelte";
    import NavLink from "../../components/utils/NavLink.svelte";
    import "../../styles/admin.css";
    import "../../styles/global.css";
    import { FirebaseManager } from '../../firebase/firebaseManager.svelte';
    import { browser } from '$app/environment';

    interface Props {
        children?: Snippet;
    }
    let { children }: Props = $props();

    let firebaseManager = $state<FirebaseManager | undefined>(browser ? new FirebaseManager() : undefined);
    setContext("firebaseManager", () => firebaseManager);

    let title = $derived((firebaseManager && firebaseManager.user) ? `Admin (${firebaseManager.user.email})` : "Admin (login)");

    onMount(async () => {
        document.body.classList.add("animated"); // Prevents animation flashing with SSR
    });

</script>

<Nav />
<PageStructure layout="content-only" title={title}>
    {#if firebaseManager && firebaseManager.user}
        <div>
            <nav class="admin-nav">
                <NavLink href="/admin">Home</NavLink>
                <NavLink href="/admin/bio">Edit Bios</NavLink>
                <NavLink href="/admin/socialmedias">Edit Social Medias</NavLink>
                <NavLink href="/admin/news">Edit News</NavLink>
                <NavLink href="/admin/concerts">Edit Concerts</NavLink>
                <NavLink href="/admin/compositions">Edit Compositions</NavLink>
                <NavLink href="/admin/discography">Edit Discography</NavLink>
                <NavLink href="/admin/videos">Edit Videos</NavLink>
                <NavLink href="/admin/gallery">Edit Gallery</NavLink>
                <NavLink href="/admin/messages">See messages</NavLink>
                <NavLink href="/admin/postgenerator">Post generator</NavLink>
            </nav>

            {@render children?.()}
        </div>
    {:else}
        <div class="center">
            <LoginForm />
        </div>
    {/if}
</PageStructure>
<footer>
    Cyprien Lengagne
    <SocialLinks />
</footer>

<style>

    .admin-nav {
        flex-wrap: wrap;
    }
    
    .center {
        margin: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }

</style>