<script lang="ts">

    import type { NewsContent } from "../../../types/news";
    import { languages } from "../../../utils/languageUtils";

    interface Props {
        text: NewsContent;
        langName: string;
    }

    let { text = $bindable(), langName }: Props = $props();

    const idBase = "" + Math.ceil(Math.random() * 10000);

</script>

<div class="news-content-editor">
    <h3>
        <img class="lang-icon" src={languages[langName].icon} alt="{languages[langName].name} language flag" />
        <span>{ languages[langName].name}</span>
    </h3>


    <label for="{idBase}-title" class="title-label">Title</label>
    <input type="text" id="{idBase}-title" class="title-field" bind:value={text.title} />
    
    <label for="{idBase}-content" class="content-label">Content</label>
    <textarea id="{idBase}-content" class="content-field" cols="8" rows="5" bind:value={text.content}></textarea>
</div>

<style>

    .news-content-editor {
        margin-bottom: 1rem;
    }

</style>