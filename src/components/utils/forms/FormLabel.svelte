<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        name: string;
        icon?: string;
        iconAlt?: string;
        error?: string;

        children: Snippet;
    }

    let { name = "", icon, iconAlt, error, children }: Props = $props();

</script>

<label>
    <div class="label-content">
        {#if icon}
            <img class="label-icon" src={icon} alt={iconAlt} />
        {/if}
        <span>{ name }</span>
    </div>

    {#if error}
        <p class="error">{ error }</p>
    {/if}

    {@render children?.()}
</label>

<style>

    label {
        margin-bottom: 1rem;
    }

    .label-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .label-icon {
        display: block;
        height: 1.5rem;
    }

    label,
    label :global(input),
    label :global(select),
    label :global(textarea) {
        display: block;
    }

    label :global(input),
    label :global(select),
    label :global(textarea) {
        margin-top: 0.25rem;
        font-size: 1.25rem;
        padding: 0.4rem;
        box-shadow: none;
        border: 0.5px solid gray;
        border-radius: 0.25rem;
        background: white;
    }

    label :global(input:focus),
    label :global(select:focus),
    label :global(textarea:focus) {
        box-shadow: 0 0.25rem 0.5rem 0.25rem rgba(0, 0, 0, 0.1);
        outline: none;
    }

    .error {
        color: rgb(180, 0, 0);
    }

</style>