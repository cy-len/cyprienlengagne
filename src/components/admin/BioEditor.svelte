<script lang="ts">

    import { type DocumentReference, updateDoc, getDoc } from "firebase/firestore";
    import { onMount } from "svelte";
    import { languages } from "../../utils/languageUtils";

    interface Props {
        bioRef: DocumentReference;
    }

    let { bioRef }: Props = $props();

    let short: string = $state("");
    let full: string = $state("");

    let hash: string = $state("");

    onMount(async () => {
        const snapshot = await getDoc(bioRef);
        const data = snapshot.data();
        if (!data) return;

        short = data.short;
        full = data.full;

        hash = short + full;
    });

    export async function save() {
        if (!modified) return;

        const data = {
            short,
            full,
        };
        await updateDoc(bioRef, data);

        hash = short + full;
    }

    const idBase = "" + Math.ceil(Math.random() * 10000);

    let modified = $derived(hash !== (short + full));
</script>

<div class="editor-container" class:modified={modified}>
    <div class="editor-grid">
        <h3 class="language">
            <img class="lang-icon" src={languages[bioRef.id].icon} alt="{languages[bioRef.id].name} language flag" />
            <span>{ languages[bioRef.id].name }</span>
        </h3> <!-- id = "en"/"fr"/"de"... -->
    
        <label for="{idBase}-short" class="short-label">Short bio</label>
        <textarea id="{idBase}-short" class="short-field" cols="30" bind:value={short}></textarea>
    
        <label for="{idBase}-full" class="full-label">Full bio</label>
        <textarea id="{idBase}-full" class="full-field" cols="30" rows="30" bind:value={full}></textarea>
    </div>
</div>

<style>

    .editor-grid {
        grid-template-areas:
            "language language"
            "short-label full-label"
            "short-field full-field";
        
        grid-template-columns: 1fr 2fr;
        grid-template-rows: min-content min-content min-content;
    }

    textarea {
        display: block;
        font: inherit;
    }

    h3 {
        margin-block: 0;
    }

    .language {
        grid-area: language;
    }

    .short-label {
        grid-area: short-label;
    }

    .short-field {
        grid-area: short-field;
    }

    .full-label {
        grid-area: full-label;
    }

    .full-field {
        grid-area: full-field;
    }
</style>