<script lang="ts">
    import { setContext } from "svelte";
    import RootLayout from "../ArtistKit/core/components/RootLayout.svelte";

    let { data, children } = $props();
    
    setContext("links", data.links);
</script>

<RootLayout>
    {@render children?.()}
</RootLayout>
