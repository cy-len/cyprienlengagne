<script lang="ts">
    import { concertsManager } from "../../../stores/concerts.svelte";
    import type { Concert } from "../../../types/concert";

    interface Props {
        selection?: { [key: number]: boolean };
        onSelectionChanged: () => any;
    }

    let { selection = $bindable({}), onSelectionChanged }: Props = $props();

    function toggleSelection(index: number) {
        selection[index] = !selection[index];

        onSelectionChanged();
    }

    export function getSelectedConcerts(): Concert[] {
        const selectedConcerts: Concert[] = [];

        for (const index in selection) {
            const isSelected = selection[index];
            if (isSelected) {
                selectedConcerts.push(concertsManager.upcoming.items[index]);
            }
        }

        return selectedConcerts;
    }

    function autoSelectNextN() {
        let n = parseInt(prompt("How many concerts do you want to include ?", "5") ?? "0");

        if (n >= concertsManager.upcoming.items.length) {
            n = concertsManager.upcoming.items.length;
            alert(`The list doesn't contain as many concerts, will select only ${n} concerts`);
        }

        for (let i = 0; i < n; i++) {
            selection[i] = true;
        }

        onSelectionChanged();
    }

    function autoSelectMonth(month: number, year: number) {
        concertsManager.upcoming.items.forEach((concert: Concert, i: number) => {
            if (concert.date.getMonth() === month && concert.date.getFullYear() === year) {
                selection[i] = true;
            }
        });

        onSelectionChanged();
    }
    
    function autoSelectThisMonth() {
        const now = new Date();
        autoSelectMonth(now.getMonth(), now.getFullYear());
    }

    function autoSelectNextMonth() {
        const now = new Date();
        now.setMonth(now.getMonth() + 1);
        autoSelectMonth(now.getMonth(), now.getFullYear());
    }

    function clearSelection() {
        Object.keys(selection).forEach((key) => {
            const i = key as unknown as number; // Fuck TS
            selection[i] = false;
        });

        onSelectionChanged();
    }
</script>

<div class="mini-toolbar">
    <button class="toolbar-button" onclick={autoSelectNextN}>Next N</button>
    <button class="toolbar-button" onclick={autoSelectThisMonth}>This month</button>
    <button class="toolbar-button" onclick={autoSelectNextMonth}>Next month</button>
    <button class="toolbar-button" onclick={clearSelection}>Clear</button>
</div>
<ul class="selector">
    {#each concertsManager.upcoming.items as concert, i}
        <li class:selected={selection[i]}>
            <button onclick={() => { toggleSelection(i); }}>
                { concert.date.toLocaleDateString() } <br />
                {concert.location}
            </button>
        </li>
    {/each}
</ul>

<style>

    .mini-toolbar {
        display: flex;
        flex-wrap: wrap;
        gap: 0.25rem;
    }

    .selector {
        list-style-type: none;
        padding: 0;
        margin: 0;
        max-height: 20rem;

        overflow: auto;
    }

    .selector li {
        padding: 0.5rem;
        cursor: pointer;

        transition: 0.25s;
    }

    .selector li:hover {
        background-color: rgba(0, 0, 0, 0.2);
    }

    .selector li.selected {
        background-color: rgba(0, 0, 0, 0.3);
    }

</style>