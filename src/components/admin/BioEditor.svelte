<script lang="ts">

    import { type DocumentReference, updateDoc, getDoc } from "firebase/firestore";
    import { onMount } from "svelte";
    import { languages } from "../../utils/languageUtils";
    import FormLabel from "../utils/forms/FormLabel.svelte";
    import Collapsible from "./utils/Collapsible.svelte";

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
    
        <Collapsible summaryText="Short">
            <FormLabel name="Short bio">
                <textarea cols="30" bind:value={short}></textarea>
            </FormLabel>
        </Collapsible>
        <Collapsible summaryText="Full">
            <textarea cols="30" rows="30" bind:value={full}></textarea>
        </Collapsible>
    </div>
</div>

<style>

    h3 {
        margin-block: 0;
    }
    
</style>