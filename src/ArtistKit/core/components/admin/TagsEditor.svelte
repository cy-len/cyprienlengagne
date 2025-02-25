<script lang="ts">
    import { slide } from "svelte/transition";
    import FormLabel from "../../utils/forms/FormLabel.svelte";

    interface Props {
        tags: {
            name: string;
            value: string;
        }[];
        blacklist?: string[];
    }

    let { tags = $bindable([]), blacklist = [] }: Props = $props();
</script>

<div class="tags-editor">
    {#each tags as tag, i}
        {#if !blacklist.includes(tag.name)}
            <div class="tag" transition:slide={{ duration: 250 }}>
                <FormLabel name="Tag name">
                    <input type="text" bind:value={tag.name} />
                </FormLabel>
                <FormLabel name="Tag value (optional)">
                    <input type="text" bind:value={tag.value} />
                </FormLabel>

                <button class="toolbar-button red" onclick={() => tags.splice(i, 1)}>Remove tag</button>
            </div>
        {/if}
    {/each}
    <div>
        <button
            class="cta-inverted"
            onclick={() => tags.push({ name: "", value: "" })}
        >
            Add a tag
        </button>
    </div>
</div>

<style>

    .tag {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .tag :global(label) {
        width: 100%;
    }

    .tag button {
        min-width: fit-content;
    }

</style>
