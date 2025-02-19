<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        name: string;

        children: Snippet;
    }

    let { name, children }: Props = $props();
</script>

<label>
    {@render children?.()}
    <span class="checkmark"></span>
    <span>{name}</span>
</label>

<style>
    /* The container */
    label {
        margin-bottom: 1rem;
        
        display: flex;
        align-items: center;
        gap: 0.5rem;
        
        cursor: pointer;
        font-size: 1rem;
        
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    /* Hide the browser's default checkbox */
    label :global(input) {
        position: absolute;
        opacity: 0;
        cursor: pointer;
        height: 0;
        width: 0;
    }

    /* Create a custom checkbox */
    .checkmark {
        position: relative;
        height: 1.5rem;
        width: 1.5rem;
        background-color: white;

        border-radius: 0.25rem;

        transition: 0.25s;
    }

    /* On mouse-over, add a grey background color */
    label:hover .checkmark {
        box-shadow: 0 0.25rem 0.5rem 0.25rem rgba(0, 0, 0, 0.1);
    }

    /* When the checkbox is checked, add a blue background */
    label :global(input:checked ~ .checkmark) {
        background-color: var(--color-primary);
    }

    /* Create the checkmark/indicator (hidden when not checked) */
    .checkmark:after {
        content: "";
        position: absolute;
        display: block;

        opacity: 0;
    }

    /* Show the checkmark when checked */
    label :global(input:checked ~ .checkmark:after) {
        opacity: 1;
    }

    /* Style the checkmark/indicator */
    label .checkmark:after {
        left: 9px;
        top: 4px;
        width: 5px;
        height: 10px;

        border: solid white;
        border-width: 0 3px 3px 0;

        -webkit-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        transform: rotate(45deg);
    }
</style>
