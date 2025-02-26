<script module lang="ts">
    export interface NavLinksParams {
        langURL: string;
        homeText: string;
        bioText: string;
        newsText: string;
        concertsText: string;
        compositionsText: string;
        mediaText: string;
        contactText: string;
    }
</script>

<script lang="ts">
    import NavLink from "./NavLink.svelte";
    import LanguagePicker from "./language/LanguagePicker.svelte";

    interface Props {
        vertical?: boolean;
        params: NavLinksParams;
    }

    let { vertical = false, params }: Props = $props();
</script>

<ul class="links" class:vertical>
    <li><NavLink href="/{params.langURL}">{params.homeText}</NavLink></li>
    <li><NavLink href="/{params.langURL}/bio">{params.bioText}</NavLink></li>
    <li><NavLink href="/{params.langURL}/news">{params.newsText}</NavLink></li>
    <li>
        <NavLink href="/{params.langURL}/concerts">
            {params.concertsText}
        </NavLink>
    </li>
    <li>
        <NavLink href="/{params.langURL}/compositions">
            {params.compositionsText}
        </NavLink>
    </li>
    <li>
        <NavLink href="/{params.langURL}/media">{params.mediaText}</NavLink>
    </li>
    <li>
        <NavLink href="/{params.langURL}/contact">{params.contactText}</NavLink>
    </li>

    {#if !vertical}
        <li class="language-picker-container">
            <LanguagePicker />
        </li>
    {/if}
</ul>

<style>
    .links {
        list-style-type: none;
        display: flex;
        gap: 1rem;
        padding: 0;
        margin: 0;
    }

    .links.vertical {
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .language-picker-container {
        margin-left: 0.5rem;
    }
</style>
