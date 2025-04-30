<script lang="ts">
    import { onMount, type Snippet } from "svelte";
    import { beforeNavigate, onNavigate } from "$app/navigation";
    import { fade } from "svelte/transition";
    import LoadingSpinner from "./LoadingSpinner.svelte";

    interface Props {
        enableLoadingSpinner?: boolean;
        loadingSpinnerBackground?: string;
        loadingSpinnerColor?: string;

        children?: Snippet;
    }

    let {
        enableLoadingSpinner = true,
        loadingSpinnerBackground = "rgba(0, 0, 0, 0.75)",
        loadingSpinnerColor = "white",
        children,
    }: Props = $props();

    onMount(() => {
        document.body.classList.add("first-page", "animated");
    });

    let showLoading = $state<boolean>(false);
    let timer: any;

    beforeNavigate(() => {
        timer = setTimeout(() => (showLoading = true), 100);
    });
    
    function navigationEnd() {
        clearTimeout(timer);
        showLoading = false;
    }

    onNavigate(async (navigation) => {
        document.body.classList.remove("first-page");

        if (!document.startViewTransition) {
            navigationEnd();
            return;
        }

        return new Promise((resolve) => {
            document.startViewTransition(async () => {
                resolve();
                await navigation.complete;
                navigationEnd();
            });
        });
    });
</script>

{@render children?.()}
{#if showLoading && enableLoadingSpinner}
    <div class="loading" style="background: {loadingSpinnerBackground};" transition:fade={{ duration: 500 }}>
        <LoadingSpinner color={loadingSpinnerColor} />
    </div>
{/if}

<style>
    .loading {
        position: fixed;
        z-index: 100000;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;

        background: rgba(0, 0, 0, 0.75);

        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
