<script lang="ts">
    import type { Snippet } from "svelte";
    import RootLayout from "../ArtistKit/core/components/RootLayout.svelte";

    interface Props {
        children: Snippet;
    }

    let { children }: Props = $props();
</script>

<RootLayout>
    {@render children?.()}
</RootLayout>
