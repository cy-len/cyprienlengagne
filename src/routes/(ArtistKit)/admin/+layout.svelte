<script lang="ts">
    import { onMount, setContext, type Snippet } from 'svelte';
    import "../../../styles/admin.css";
    import "../../../styles/global.css";
    import { browser } from '$app/environment';
    import LoginForm from '../../../ArtistKit/core/components/admin/LoginForm.svelte';
    import Nav from '../../../ArtistKit/core/components/nav/Nav.svelte';
    import SocialLinks from '../../../ArtistKit/core/components/SocialLinks.svelte';
    import { FirebaseManager } from '../../../ArtistKit/core/libs/firebaseManager.svelte';
    import PageStructure from '../../../components/PageStructure.svelte';
    import NavLink from '../../../ArtistKit/core/components/nav/NavLink.svelte';

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

    .admin-nav :global(a) {
        color: black;
    }

    .admin-nav :global(a:hover) {
        border-bottom-color: var(--color-primary);
    }

    .admin-nav :global(a.active) {
        color: var(--color-primary);
    }
    
    .center {
        margin: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }

</style>