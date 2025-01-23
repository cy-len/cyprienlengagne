<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        summaryText: string;
        children?: Snippet;
    }

    let { summaryText, children }: Props = $props();

    let details: HTMLDetailsElement;

    export function expand() {
        details.open = true;
    }

    export function collapse() {
        details.open = false;
    }

</script>

<details bind:this={details}>
    <summary>
        <div class="summary-wrapper">
            <h4>{ summaryText }</h4>
            <div class="info">Click to edit</div>
        </div>
    </summary>

    <div class="details-content">
        {@render children?.()}
    </div>
</details>

<style>

    details {
        margin-bottom: 0.5rem;
    }

    summary {
        list-style: none;
        display: flex;
        align-items: start;
        cursor: pointer;
    }

    summary::before {
        content: '▶︎';
        margin-top: 0.25rem;
        width: 1em;
        flex-shrink: 0;
        transition: 0.3s;
    }
    details[open] > summary::before {
        transform: rotate(90deg);
        transform-origin: 40% 45% 0;
    }

    .summary-wrapper {
        display: inline-block;
        user-select: none;
    }

    h4 {
        margin: 0;
        font-size: 1.125rem;
    }

    .details-content {
        padding: 0.5rem 0 1rem 1rem;
    }

</style>