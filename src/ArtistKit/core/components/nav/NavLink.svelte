<script lang="ts">
    import { page } from "$app/stores";

    interface Props {
        href: string;
        aExtraClass?: string;
        children?: import('svelte').Snippet;
    }

    let { href, aExtraClass = "", children }: Props = $props();

    let active = $derived($page.url.pathname === href);
</script>

<a href={href} class={aExtraClass} class:active={active}>{@render children?.()}</a>

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