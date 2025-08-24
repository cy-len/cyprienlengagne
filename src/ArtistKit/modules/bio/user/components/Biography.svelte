<script lang="ts">
    import type { SingleBioPreview } from "../../../../../artkyt/types";
    import type { Result } from "../../../../../utils/result";

    interface Props {
        bio: Result<{ bio: SingleBioPreview }>;
        lang?: string;
        downloadText?: string;
    }

    let { bio, lang = "en", downloadText = "Download biography" }: Props = $props();
</script>

{#if bio.success}
    <p class="line-breaks">{bio.value.bio.content}</p>
    <div class="actions">
        <a
            href="data:application/octet-stream;charset=utf-16le;base64,{btoa(unescape(encodeURIComponent(bio.value.bio.content)))}"
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
{:else}
    <p>An error occured while fecthing the biography</p>
{/if}

<style>
    .cta {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
    }
</style>
