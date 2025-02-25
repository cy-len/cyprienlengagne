<script lang="ts">
    import { languages } from "../../../utils/languageUtils";
    import FormLabel from "../forms/FormLabel.svelte";

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
        <FormLabel
            name={useEnglishAsDefault ? "Default/English (appears if the language requested is not provided)" : "Default (appears if the language requested is not provided)"}
            icon={useEnglishAsDefault ? languages["en"].icon : undefined}
            iconAlt="English language flag"
        >
            <textarea cols="4" bind:value={defaultText}></textarea>
        </FormLabel>
    </div>

    {#each correctedSupportedLanguages as langKey}
        {@const lang = languages[langKey]}

        <div class="lang">
            <FormLabel
                name={lang.name}
                icon={lang.icon}
                iconAlt="{lang.name} language flag"
            >
                {#if lingualTexts[langKey] !== undefined}
                    <textarea rows="4" bind:value={lingualTexts[langKey]}></textarea>
                    <button class="toolbar-button" onclick={() => setSameAsDefault(langKey)}>Make same as default</button>
                {:else}
                    <div class="info">Currently set to be the same as default</div>
                    <button class="toolbar-button" onclick={() => { lingualTexts[langKey] = ""; }}>Make different from default</button>
                {/if}
            </FormLabel>
        </div>
    {/each}
</div>

<style>

    .lang {
        padding: 0.5rem 0;
        margin-bottom: 0.5rem;
    }

</style>