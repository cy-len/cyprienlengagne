<script lang="ts">
    import { socialMediasManager } from "../../modules/socialMedias/socialMediasManager.svelte";

    interface Props {
        text?: "media" | "handles" | "off";
        bigIcons?: boolean;
    }

    let { text = "off", bigIcons = false }: Props = $props();
</script>

<ul class:big-icons={bigIcons}>
    {#if socialMediasManager.socialMedias.youtube.handle}
        <li>
            <a
                href="https://www.youtube.com/{socialMediasManager.socialMedias.youtube.handle}"
                target="_blank"
                rel="noopener noreferrer"
            >
                <img src="/icons/youtube.svg" alt="Youtube" class="icon" />

                {#if text === "handles"}
                    <span>{socialMediasManager.socialMedias.youtube.handle}</span>
                {:else if text === "media"}
                    <span>YouTube</span>
                {/if}
            </a>
        </li>
    {/if}
    {#if socialMediasManager.socialMedias.facebook.handle}
        <li>
            <a
                href="https://www.facebook.com/{socialMediasManager.socialMedias.facebook.handle}"
                target="_blank"
                rel="noopener noreferrer"
            >
                <img src="/icons/facebook.svg" alt="Facebook" class="icon" />

                {#if text === "handles"}
                    <span>{socialMediasManager.socialMedias.facebook.handle}</span>
                {:else if text === "media"}
                    <span>Facebook</span>
                {/if}
            </a>
        </li>
    {/if}
    {#if socialMediasManager.socialMedias.instagram.handle}
        <li>
            <a
                href="https://www.instagram.com/{socialMediasManager.socialMedias.instagram.handle}"
                target="_blank"
                rel="noopener noreferrer"
            >
                <img src="/icons/instagram.svg" alt="Instagram" class="icon" />

                {#if text === "handles"}
                    <span>{socialMediasManager.socialMedias.instagram.handle}</span>
                {:else if text === "media"}
                    <span>Instagram</span>
                {/if}
            </a>
        </li>
    {/if}
</ul>

<style>
    ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
        display: flex;
        gap: 0.5rem;
    }

    a {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 0.5rem;

        color: black;
        text-decoration: none;

        padding: 0.25rem;
        border-radius: 0.5rem;
        transition: 0.25s;
    }

    a:hover {
        background-color: rgba(255, 255, 255, 0.25);
    }

    img {
        display: block;
        height: 2rem;
    }

    ul.big-icons img {
        height: 2.5rem;
    }
</style>
