<script lang="ts">
    import { setContext } from "svelte";
    import { writable } from "svelte/store";
    import type { OpenGraphProps } from "../types/openGraphProps";

    const openGaphProps = writable<OpenGraphProps>({
        title: "Cyprien Lengagne"
    });

    setContext("openGraphProps", openGaphProps);

</script>

<svelte:head>
    <title>{$openGaphProps.title} - Cyprien Lengagne</title>
    <meta property="og:title" content="{$openGaphProps.title} - Cyprien Lengagne" />
    <meta property="og:type" content="website" />
    <meta property="description" content={$openGaphProps.description ?? ""} />
    <meta property="og:description" content={$openGaphProps.description ?? ""} />
    <meta property="og:image" content={$openGaphProps.imageUrl ?? "https://cyprienlengagne.com/Valere_Top.webp"} />
    <meta property="og:image:secure_url" content={$openGaphProps.imageUrl ?? "https://cyprienlengagne.com/Valere_Top.webp"} />
</svelte:head>

<slot />