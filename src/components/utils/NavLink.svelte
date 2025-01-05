<script lang="ts">
    import { page } from "$app/stores";

    export let href: string;
    export let aExtraClass: string = "";

    $: active = $page.url.pathname === href;
</script>

<a href={href} class={aExtraClass} class:active={active}><slot /></a>

<style>
    a {
        font-size: 1.125rem;
        color: white;
        text-decoration: none;

        border-bottom: 1px solid transparent;

        transition: 0.25s;
    }

    a:hover {
        border-bottom-color: white;
    }

    a.active {
        border-bottom-color: var(--color-primary);
        color: var(--color-primary);
        font-weight: bold;
    }
</style>