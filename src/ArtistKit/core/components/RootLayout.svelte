<script lang="ts">
    import type { Snippet } from "svelte";
    import { onNavigate } from "$app/navigation";
    import { initOpenGraph, type OpenGraphProps } from "../utils/openGraphManager.svelte";
    import { page } from "$app/state";
    import { browser } from "$app/environment";

    interface Props {
        titleAppendix: string;
        hideAppendixBlacklist?: string[];
        defaultOpenGraph: OpenGraphProps;

        children?: Snippet;
    }

    let { titleAppendix, hideAppendixBlacklist = [], defaultOpenGraph, children }: Props = $props();

    const openGraphManager = initOpenGraph(defaultOpenGraph);

    onNavigate((navigation) => {
        if (!document.startViewTransition) return;

        return new Promise((resolve) => {
            document.startViewTransition(async () => {
                resolve();
                await navigation.complete;
            });
        });
    });

    let title = $derived.by(() => {
        if (hideAppendixBlacklist.includes(page.url.pathname)) return openGraphManager.openGraphProps.title;
        return `${openGraphManager.openGraphProps.title} ${titleAppendix}`;
    });

</script>

<svelte:head>
    <title>{title}</title>
    <meta property="og:title" content="{title}" />
    <meta property="og:type" content="website" />
    <meta property="description" content={openGraphManager.openGraphProps.description ?? ""} />
    <meta property="og:description" content={openGraphManager.openGraphProps.description ?? ""} />
    <meta property="og:image" content={openGraphManager.openGraphProps.imageUrl ?? "https://cyprienlengagne.com/imgs/Valere_Top.webp"} />
    <meta property="og:image:secure_url" content={openGraphManager.openGraphProps.imageUrl ?? "https://cyprienlengagne.com/imgs/Valere_Top.webp"} />
</svelte:head>

{@render children?.()}