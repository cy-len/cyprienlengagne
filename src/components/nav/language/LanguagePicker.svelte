<script lang="ts">
    import { page } from "$app/stores";
    import LanguagePickerBar from "./LanguagePickerBar.svelte";
    import { fade } from "svelte/transition";
    import { languages } from "./languages";

    let barOpen: boolean = false;

    $: currentFlag = languages[$page.url.pathname.split("/")[1]]?.icon ?? "/icons/english.svg";
</script>

<button class="language-picker" on:click={() => barOpen = !barOpen}>
    <img class="icon" src={currentFlag} alt="Current language flag" />
    &#9662;
</button>
{#if barOpen}
    <div class="floating-bar" transition:fade={{ duration: 100 }}>
        <LanguagePickerBar />
    </div>
{/if}

<style>

    .floating-bar {
        position: fixed;
        top: 4rem;
        right: 0.5rem;
        border-radius: 1rem;

        padding: 1rem;
        background-color: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(2rem);
    }

    .language-picker {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 1.125rem;
        color: white;
        padding: 0.5rem;
        margin: -0.5rem;
    }

    .language-picker:hover .icon {
        opacity: 1;
    }

    .icon {
        height: 1.125rem;
        opacity: 0.8;
    }

</style>