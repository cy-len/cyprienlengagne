<script lang="ts">
    import NavLinks from "./NavLinks.svelte";
    import type { NavLinksParams } from "./NavLinks.svelte";
    import LanguagePickerBar from "./language/LanguagePickerBar.svelte";
    import { onNavigate } from "$app/navigation";

    interface Props {
        navParams: NavLinksParams;
    }

    let { navParams }: Props = $props();

    let open = $state(false);

    onNavigate(() => {
        open = false;
    });
</script>

<div class="wrapper" class:slideover-open={open}>
    <button class="hamburger soft-button" onclick={() => (open = true)}>
        <img class="icon" src="/icons/hamburger-menu.svg" alt="Menu" />
    </button>
    <div class="slideover bg-very-light" class:open>
        <button class="soft-button" onclick={() => (open = false)}>
            <img class="icon close" src="/icons/close.svg" alt="Menu" />
        </button>
        <div class="mobile-nav">
            <NavLinks vertical={true} params={navParams} />
        </div>
        <LanguagePickerBar />
    </div>
    <div class="backdrop" class:open></div>
</div>

<style>
    .wrapper {
        isolation: isolate;
    }

    .close {
        filter: invert(100%);
    }

    .slideover-open .hamburger {
        opacity: 0;
    }

    .slideover {
        position: fixed;
        top: 0;
        right: 0;
        z-index: 1000;
        pointer-events: none;
        opacity: 0;
        transform: translateX(5rem);

        transition: 0.5s;

        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 2rem;

        padding: 1rem;
        background-color: rgba(0, 0, 0, 0.85);
        height: 100dvh;
        box-sizing: border-box;
    }

    .slideover.open {
        opacity: 1;
        pointer-events: all;
        transform: translateX(0);
    }

    .backdrop {
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        width: 100vw;
        opacity: 0;
        z-index: 999;
        pointer-events: none;
        background-color: rgba(0, 0, 0, 0.4);
        transition: 0.5s;
    }

    .backdrop.open {
        opacity: 1;
    }

    .mobile-nav {
        padding: 1rem;
        flex: 1;
    }
</style>
