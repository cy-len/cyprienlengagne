<script lang="ts">
    import FormLabel from "../../../../core/components/forms/FormLabel.svelte";
    import type { NewsContent } from "../../newsManager.svelte";


    interface Props {
        text: NewsContent;
        langName: string;
    }

    let { text = $bindable(), langName }: Props = $props();

</script>

<div class="news-content-editor">
    <h3>
        <img class="lang-icon" src={languages[langName].icon} alt="{languages[langName].name} language flag" />
        <span>{ languages[langName].name}</span>
    </h3>

    <FormLabel name="Title">
        <input type="text" bind:value={text.title} />
    </FormLabel>
    <FormLabel name="Content">
        <textarea cols="8" rows="5" bind:value={text.content}></textarea>
    </FormLabel>
</div>

<style>

    .news-content-editor {
        margin-bottom: 1rem;
    }

    .lang-icon {
        height: 1.5rem;
    }

</style>