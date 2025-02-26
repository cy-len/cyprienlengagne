<script lang="ts">
    import type { Snippet } from "svelte";
    import type { Artist } from '../../artistsManager.svelte';
    import ArtistItem from './defaults/ArtistItem.svelte';

    interface Props {
        artistsList: Artist[];

        artistItem?: Snippet<[{ artist: Artist }]>;
    }

    let {
        artistsList,
        artistItem
    }: Props =$props();
</script>

<ul>
    {#each artistsList as artist}
        <li>
            {#if artistItem}
                {@render artistItem({ artist })}
            {:else}
                <ArtistItem {artist} />
            {/if}
        </li>
    {/each}
</ul>

<style>

    ul {
        list-style-type: none;
        padding: 0;
    }

</style>