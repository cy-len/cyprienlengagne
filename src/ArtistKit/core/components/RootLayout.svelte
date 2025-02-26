<script lang="ts">
    import { onMount, type Snippet } from "svelte";
    import { beforeNavigate, onNavigate } from "$app/navigation";
    import {
        initOpenGraph,
        type OpenGraphProps,
    } from "../utils/openGraphManager.svelte";
    import { page } from "$app/state";
    import { fade } from "svelte/transition";
    import LoadingSpinner from "./LoadingSpinner.svelte";

    interface Props {
        titleAppendix: string;
        hideAppendixBlacklist?: string[];
        defaultOpenGraph: OpenGraphProps;

        enableLoadingSpinner?: boolean;
        loadingSpinnerBackground?: string;
        loadingSpinnerColor?: string;

        children?: Snippet;
    }

    let {
        titleAppendix,
        hideAppendixBlacklist = [],
        defaultOpenGraph,
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

    onNavigate(async (navigation) => {
        if (!document.startViewTransition) return;

        document.body.classList.remove("first-page");

        return new Promise((resolve) => {
            document.startViewTransition(async () => {
                resolve();
                await navigation.complete;
                clearTimeout(timer);
                showLoading = false;
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
