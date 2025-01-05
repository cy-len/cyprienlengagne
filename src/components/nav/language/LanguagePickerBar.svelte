<script lang="ts">
    import { page } from "$app/stores";
    import NavLink from "../../utils/NavLink.svelte";
    import { languages } from "./languages";

    function makeUrl(language: string, pathname: string) {
        const parts = pathname.split("/");
        parts.shift();
        parts[0] = language;

        return `/${parts.join("/")}`;
    }
</script>

<div class="language-bar">
    {#each Object.values(languages) as language}
        <NavLink href={makeUrl(language.code, $page.url.pathname)} aExtraClass="ignore-enlargement">
            <div class="language">
                <img class="icon" src={language.icon} alt="{language.name} language flag" />
                <span>{ language.name }</span>
            </div>
        </NavLink>
    {/each}
</div>

<style>

    .language-bar {
        display: flex;
        gap: 1rem;
    }

    .language {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
    }

    .language .icon {
        height: 1.25rem;
    }

</style>