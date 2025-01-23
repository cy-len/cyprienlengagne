<script lang="ts">
    import { languages } from "../../utils/languageUtils";

    interface Props {
        supportedLanguages?: string[];
        useEnglishAsDefault?: boolean;
        defaultText: string;
        lingualTexts: { [key: string]: string | undefined };
    }

    let {
        supportedLanguages = Object.keys(languages),
        useEnglishAsDefault = true,
        defaultText = $bindable(),
        lingualTexts = $bindable()
    }: Props = $props();

    const idBase = `multilingual-${Math.round(Math.random() * 10000)}`;

    function setSameAsDefault(langKey: string) {
        if (lingualTexts[langKey]) {
            const langName = languages[langKey].name;
            const areYouSure = prompt(`This will make the text in ${langName} the same as the default one. The custom text for ${langName} will be lost. If you want to proceed, type YES`);
            if (areYouSure !== "YES") return;
        }

        lingualTexts[langKey] = undefined;
    }

    let correctedSupportedLanguages = $derived(useEnglishAsDefault ? supportedLanguages.filter((id) => id !== "en") : supportedLanguages);

</script>

<div>
    <div class="lang">
        <label for="{idBase}-lang-default" class="lang-default-label">
            {#if useEnglishAsDefault}
                <img class="lang-icon" src={languages["en"].icon} alt="English language flag" />
                <span>Default/English (appears if the language requested is not provided)</span>
            {:else}
                <span>Default (appears if the language requested is not provided)</span>
            {/if}
        </label>
        <textarea id="{idBase}-default" class="default-field" cols="4" bind:value={defaultText}></textarea>
    </div>

    {#each correctedSupportedLanguages as langKey}
        {@const lang = languages[langKey]}

        <div class="lang">
            <label for="{idBase}-lang-{langKey}" class="lang-{langKey}-label">
                <img class="lang-icon" src={lang.icon} alt="{lang.name} language flag" />
                <span>{ lang.name }</span>
            </label>
    
            {#if lingualTexts[langKey] !== undefined}
                <textarea id="{idBase}-lang-{langKey}" class="lang-{langKey}-field" rows="4" bind:value={lingualTexts[langKey]}></textarea>
                <button class="toolbar-button" onclick={() => setSameAsDefault(langKey)}>Make same as default</button>
            {:else}
                <div class="info">Currently set to be the same as default</div>
                <button class="toolbar-button" onclick={() => { lingualTexts[langKey] = ""; }}>Make different from default</button>
            {/if}
        </div>

    {/each}
</div>

<style>

    label {
        display: block;
        margin-bottom: 0.5rem;
    }

    textarea {
        display: block;
        font: inherit;
        min-height: 5rem;
    }

    .lang {
        padding: 0.5rem 0;
        margin-bottom: 0.5rem;
    }

    .lang label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

</style>