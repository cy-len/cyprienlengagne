<script lang="ts">

    interface Props {
        progress: number;
    }

    let { progress }: Props = $props();

</script>

<div class="progress-bar" style="--progress: {progress}%">
    <span>{ progress.toFixed(2) }%</span>
    <div class="backdrop"></div>
</div>

<style>

    .progress-bar {
        --progress: 0%;

        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 1.5rem;
        width: 10rem;
        text-align: center;

        border: 1px solid black;
    }

    .backdrop {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: var(--progress);
        z-index: -1;

        background-color: rgba(64, 255, 64, 0.5);

        transition: 0.25s;
    }

</style>