<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        children: Snippet;
    }

    let { children }: Props = $props();

</script>

<div class="form-success">
    <img src="/icons/ok.svg" alt="Form Success" />
    <p>
        {@render children?.()}
    </p>
</div>

<style>

    .form-success {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    img {
        width: 100%;
        max-width: 10rem;
    }

</style>