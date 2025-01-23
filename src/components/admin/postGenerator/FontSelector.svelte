<script lang="ts">
    import { onMount } from "svelte";

    export const label = "Font";
    interface Props {
        font?: string;
        onchange: (font: string) => any;
    }

    let { font = $bindable("Montserrat"), onchange }: Props = $props();

    let select: HTMLSelectElement;

    const fonts = [
        "Aboreto",
        "Montserrat",
        "Verdana",
        "Arial",
        "Segoe UI"
    ];

    const id = `font-selector-${Math.floor(Math.random() * 10000)}`;

    function fontSelected() {
        font = fonts[select.selectedIndex];
        onchange(font);
    }

    onMount(() => {
        select.selectedIndex = fonts.indexOf(font);
    })

</script>

<label for={id}>{label}</label>
<select name={id} id={id} bind:this={select} onchange={fontSelected} style="font-family: {`"${font}"`}">
    {#each fonts as font}
        <option value={font} style="font-family: {`"${font}"`}">{font}</option>
    {/each}
</select>

<style>
    label, select {
        display: block;
        font-size: 1rem;
    }

    option {
        font-size: 0.9rem;
    }
</style>