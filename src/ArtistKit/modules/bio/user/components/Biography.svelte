<script lang="ts">
    import { bios } from "../../biosManager.svelte";

    interface Props {
        lang?: string;
        downloadText?: string;
    }

    let { lang = "en", downloadText = "Download biography" }: Props = $props();
</script>

<p class="line-breaks">{bios.language(lang).biography.full}</p>
<div class="actions">
    <a
        href="data:application/octet-stream;charset=utf-16le;base64,{btoa(unescape(encodeURIComponent(bios.language(lang).biography.full)),)}"
        download="Bio_{lang.toUpperCase()}"
        class="cta"
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
        >
            <title> download </title>
            <path fill="currentColor" d="M17 12v5H3v-5H1v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5z" />
            <path fill="currentColor" d="M10 15l5-6h-4V1H9v8H5l5 6z" />
        </svg>
        <span>{downloadText}</span>
    </a>
</div>

<style>
    .cta {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
    }
</style>
