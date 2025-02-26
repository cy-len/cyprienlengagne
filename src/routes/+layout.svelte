<script lang="ts">
    import type { Snippet } from "svelte";
    import RootLayout from "../ArtistKit/core/components/RootLayout.svelte";

    interface Props {
        children: Snippet;
    }

    let { children }: Props = $props();
</script>

<RootLayout
    titleAppendix="- Cyprien Lengagne"
    hideAppendixBlacklist={["/", "/en", "/fr"]}
    defaultOpenGraph={{
        title: "Cyprien Lengagne",
        description: "Website of the swiss-french cellist and composer Cyprien Lengagne",
        imageUrl: `https://cyprienlengagne.com/imgs/Valere_Top.webp`,
    }}
>
    {@render children?.()}
</RootLayout>
