<script lang="ts">
    import { getContext } from "svelte";
    import type { ArtkytProfileLink } from "../../../artkyt/types";
    import { socialPlatformCodeToPlatform, type SocialPlatformCode } from "../../../artkyt/constants/externalPlatforms";

    interface Props {
        text?: "media" | "handles" | "off";
        bigIcons?: boolean;
    }

    const links = getContext<ArtkytProfileLink[]>("links");

    let { text = "off", bigIcons = false }: Props = $props();
</script>

<ul class:big-icons={bigIcons}>
    {#each links as link}
        {@const platform = socialPlatformCodeToPlatform[link.kind as SocialPlatformCode]}
         <li>
            <a
                href={link.value}
                target="_blank"
                rel="noopener noreferrer"
            >
                <img src="https://www.artkyt.com{platform.iconUrl}" alt={platform.label} class="icon" />

                {#if text === "handles"}
                    <span>{link.value}</span>
                {:else if text === "media"}
                    <span>{platform.label}</span>
                {/if}
            </a>
        </li>
    {/each}
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
        object-fit: contain;
    }
</style>
